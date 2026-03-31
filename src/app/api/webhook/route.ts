import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

function logTrace(msg: string) {
    try {
        fs.appendFileSync(process.cwd() + "/webhook-trace.log", new Date().toISOString() + " - " + msg + "\n");
    } catch (e) {}
}

import {
    MessageNewEvent,
    CallEndedEvent,
    CallRecordingReadyEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallTranscriptionReadyEvent
} from "@stream-io/node-sdk";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";
import { generateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import { } from "openai/resources/index.mjs";

// const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature)
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature")
    const apiKey = req.headers.get("x-api-key")

    if (!signature || !apiKey) {
        return NextResponse.json({ error: "Missing headers" }, { status: 400 })
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let payload: unknown;
    try {
        payload = JSON.parse(body)
    } catch (error) {
        console.error("Error parsing webhook payload:", error);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const eventType = (payload as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payload as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, meetingId),
                    not(eq(meetings.status, "completed")),
                    not(eq(meetings.status, "active")),
                    not(eq(meetings.status, "cancelled")),
                    not(eq(meetings.status, "processing"))
                )
            );

        if (!existingMeeting) {
            return NextResponse.json({ error: "Meeting Not found" }, { status: 404 })
        }

        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id))
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (existingAgent) {
            try {
                // console.log(`[Webhook] Connecting AI Agent ${existingAgent.id} to call ${meetingId}...`);
                const call = streamVideo.video.call("default", meetingId);
                const realtimeClient = await streamVideo.video.connectOpenAi({
                    call,
                    openAiApiKey: process.env.OPENAI_API_KEY!,
                    agentUserId: existingAgent.id,
                });

                // console.log(`[Webhook] RealtimeClient connected, updating session instructions...`);
                realtimeClient.updateSession({
                    instructions: existingAgent.instructions,
                });
                // console.log(`[Webhook] AI Agent connection successful.`);
            } catch (error) {
                console.error("[Webhook] Error connecting AI Agent:", error);
            }
        }
    } else if (eventType === "call.session_participant_left") {
        const event = payload as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();
    } else if (eventType === "call.session_ended") {
        const event = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }
        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));

    } else if (eventType === "call.transcription_ready") {
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1]
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }
        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json({ error: "Meeting Not found" }, { status: 404 })
        }

        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            }
        })

    } else if (eventType === "call.recording_ready") {
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        if (!meetingId) {
            return NextResponse.json({ error: "Missing meetingId" }, { status: 400 });
        }

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId))
    } else if (eventType === "message.new") {
        const event = payload as MessageNewEvent;
        const userId = event.user?.id;
        const channelId = event.channel_id;
        const text = event.message?.text;
        
        logTrace("Received message.new! userId=" + userId + ", channelId=" + channelId + ", text=" + text);

        if (!userId || !channelId || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")))

        if (!existingMeeting) {
            logTrace("Meeting not found. Status 404.");
            return NextResponse.json({ error: "Meeting Not found" }, { status: 404 })
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId))

        if (!existingAgent) {
            logTrace("Agent not found. Status 404.");
            return NextResponse.json({ error: "Agent Not found" }, { status: 404 })
        }

        logTrace("Found meeting and agent. agentId=" + existingAgent.id);

        if (userId !== existingAgent.id) {
            logTrace("User is not the agent. Starting Gemini generation...");
            await inngest.send({
                name: "chat/message.new",
                data: {
                    channelId,
                    text,
                    agentId: existingAgent.id,
                    agentName: existingAgent.name,
                    instructions: existingAgent.instructions,
                    summary: existingMeeting.summary
                }
            });
            logTrace("Successfully dispatched inngest event chat/message.new");
        } else {
            logTrace("User IS the agent. Ignoring message.");
        }
    }

    logTrace("Returning 200 OK.");
    return NextResponse.json({ status: "ok" })
}