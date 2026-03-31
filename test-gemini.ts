import OpenAI from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openRouterModel = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";
const openRouterClient = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY!,
    baseURL: "https://openrouter.ai/api/v1",
});

async function test() {
    try {
        const instructions = "You are a helpful assistant.";
        const response = await openRouterClient.chat.completions.create({
            model: openRouterModel,
            messages: [
                { role: "system", content: instructions },
                { role: "user", content: "Hello!" },
            ],
        });

        console.log("Response:", response.choices?.[0]?.message?.content);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
