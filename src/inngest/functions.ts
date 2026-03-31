import JSONL from "jsonl-parse-stringify"
import OpenAI from "openai";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
const openRouterBaseUrl = "https://openrouter.ai/api/v1/";
const openRouterModels = (process.env.OPENROUTER_MODELS || process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini")
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);

const summarySystemPrompt = `You are an expert summarizer.
You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.
Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z`.trim();

const openRouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: openRouterBaseUrl,
});

async function raceOpenRouterCompletion(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<{ model: string; text: string }> {
  const controllers = openRouterModels.map(() => new AbortController());

  const requests = openRouterModels.map((model, index) =>
    openRouterClient.chat.completions
      .create(
        {
          model,
          messages,
        },
        {
          signal: controllers[index].signal,
        }
      )
      .then((response) => {
        const text = response.choices?.[0]?.message?.content?.trim();
        if (!text) {
          throw new Error(`Empty response from ${model}`);
        }
        return { model, text };
      })
  );

  try {
    const winner = await Promise.any(requests);
    controllers.forEach((controller) => controller.abort());
    return winner;
  } catch (error) {
    const results = await Promise.allSettled(requests);
    const messages = results
      .map((result, index) => {
        if (result.status === "fulfilled") return null;
        return `${openRouterModels[index]}: ${String(result.reason)}`;
      })
      .filter(Boolean)
      .join(" | ");

    throw new Error(`All OpenRouter models failed. ${messages}`);
  }
}

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings-processing" },
  { event: "meetings/processing" },

  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return await fetch(event.data.transcriptUrl).then((res) => res.text())
    })
    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id))
      ];

      const userSpeakers = await db.
        select().
        from(user).
        where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        )

      const agentSpeakers = await db.
        select().
        from(agents).
        where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          })
          )
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            }
          }
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          }
        }
      })
    });

    const summaryPrompt = `Summarize the following transcript:\n\n${JSON.stringify(
      transcriptWithSpeakers,
      null,
      2
    )}`;

    const summaryResponse = await raceOpenRouterCompletion([
      { role: "system", content: summarySystemPrompt },
      { role: "user", content: summaryPrompt },
    ]);

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: summaryResponse.text,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
  },
);

export const chatMessageProcessing = inngest.createFunction(
  { id: "chat-message-processing" },
  { event: "chat/message.new" },
  async ({ event, step }) => {
    const { channelId, text, agentId, agentName, instructions, summary } = event.data;

    try {
      await step.run("generate-openrouter-response", async () => {
            const fullInstructions = `
                You are an AI assistant helping the user revisit a recently completed meeting.
                Below is a summary of the meeting, generated from the transcript:
                
                ${summary}
                
                The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
                
                ${instructions}
                
                The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
                Always base your responses on the meeting summary above.
                
                You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
                
                If the summary does not contain enough information to answer a question, politely let the user know.
                
                Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
            `;

            const channel = streamChat.channel("messaging", channelId);
            await channel.watch();

            // Send a typing indicator from the AI Agent
            await channel.sendEvent({
              type: "typing.start",
              user: { id: agentId }
            });

            let previousMessage = channel.state.messages
              .filter((msg) => msg.text && msg.text.trim() !== "")
              .map((message) => ({
                role: message.user?.id === agentId ? "assistant" : "user",
                content: message.text || "",
              }));

            // Filter for strictly alternating roles starting with "user"
            const filteredMessages: Array<{ role: "user" | "assistant"; content: string }> = [];
            for (const msg of previousMessage) {
              if (filteredMessages.length === 0 && msg.role === "assistant") continue;
              if (filteredMessages.length > 0 && filteredMessages[filteredMessages.length - 1].role === msg.role) continue;
              filteredMessages.push(msg);
            }

            previousMessage = filteredMessages.slice(-5);

            if (previousMessage.length > 0 && previousMessage[previousMessage.length - 1].role === "user") {
              previousMessage[previousMessage.length - 1].content += "\n" + text;
            } else {
              previousMessage.push({
                role: "user",
                content: text,
              });
            }

            const openRouterResponse = await raceOpenRouterCompletion([
              { role: "system", content: fullInstructions },
              ...previousMessage,
            ]);

            const openRouterResponseText = openRouterResponse.text;

            if (openRouterResponseText) {
            const avatarUri = generateAvatarUri({
                seed: agentName,
                variant: "botttsNeutral"
            });

            await streamChat.upsertUser({
                id: agentId,
                name: agentName,
                image: avatarUri,
            });

            await channel.sendMessage({
              text: openRouterResponseText,
              user: {
                id: agentId,
                name: agentName,
                image: avatarUri,
              }
            });

            // Stop the typing indicator
              await channel.sendEvent({
                type: "typing.stop",
                user: { id: agentId }
              });
              }
            }); // end step.run
          } catch (error: any) {
      console.error("Error in chatMessageProcessing Inngest function:", error);
      import("fs").then(fs => {
          try { fs.appendFileSync(process.cwd() + "/webhook-trace.log", new Date().toISOString() + " - Inngest ERROR: " + JSON.stringify(error) + "\n"); } catch(e){}
      });

      // Stop the typing indicator gracefully and send an error message to the user
      try {
          const channel = streamChat.channel("messaging", channelId);
          await channel.sendEvent({
              type: "typing.stop",
              user: { id: agentId }
          });
          
          let errorMessage = "Sorry, I encountered an error while processing your request.";
            if (JSON.stringify(error).includes("429") || JSON.stringify(error).includes("quota")) {
              errorMessage = "Sorry, I have currently exceeded the rate limit for OpenRouter. Please wait a minute and try again!";
            }

          const avatarUri = generateAvatarUri({
              seed: agentName,
              variant: "botttsNeutral"
          });

          await channel.sendMessage({
              text: errorMessage,
              user: {
                  id: agentId,
                  name: agentName,
                  image: avatarUri,
              }
          });
      } catch (recoveryError) {
          console.error("Failed to recover and send error message:", recoveryError);
      }
      
      throw error;
  }
}
);