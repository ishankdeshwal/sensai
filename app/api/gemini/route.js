import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { initialMessage } from "@/app/lib/data";

export const runtime = "edge";

const customGoogle = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

const generateId = () => Math.random().toString().slice(2, 15);

const buildGoogleGenAIPrompt = (messages) => {
  return messages.map((message) => ({
    id: message.id || generateId(),
    role: message.role === "system" ? "user" : message.role,
    content: message.content,
  }));
};

export async function POST(req) {
  try {
    const { messages } = await req.json();

    console.log("Incoming messages:", JSON.stringify(messages, null, 2));

    const allMessages = [initialMessage, ...messages];

    const stream = await streamText({
      model: customGoogle("gemini-1.5-flash"),
      messages: allMessages,
      temperature: 0.7,
      onChunk(event) {
        console.log("CHUNK:", event);
      },
      onError(err) {
        console.error("GEMINI ERROR >>>", err);
      },
      onCompletion(event) {
        console.log("COMPLETED:", event);
      },
    });

    return stream.toDataStreamResponse();
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
