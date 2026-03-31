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
        const response = await openRouterClient.chat.completions.create({
            model: openRouterModel,
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello!" },
                { role: "user", content: "How are you?" },
            ],
        });
        console.log("Response:", response.choices?.[0]?.message?.content);
    } catch (e) {
        console.error("Error:", (e as Error).message || e);
    }
}
test();
