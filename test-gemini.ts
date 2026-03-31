import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

const geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function test() {
    try {
        const instructions = "You are a helpful assistant.";
        const previousMessage = [
            {
                role: "user",
                parts: [{ text: "Hello!" }]
            }
        ];

        const response = await geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: previousMessage,
            config: {
                systemInstruction: instructions,
            }
        });

        console.log("Response:", response.text);
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
