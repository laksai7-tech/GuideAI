import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role, ModelType } from "../types";

// Initialize the client outside the function to reuse connection if possible
// Ensure API_KEY is available in the environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamChatResponse = async (
  messages: Message[],
  modelType: ModelType,
  enableThinking: boolean,
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
) => {
  try {
    // 1. Prepare history for the chat session
    // Exclude the last message (current user prompt) which we send via sendMessageStream
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== Role.USER) {
      throw new Error("Invalid message history state");
    }

    // 2. Configure the chat
    const config: any = {
      temperature: 0.7,
      systemInstruction: "You are GuideAI, a next-generation AI assistant. You are helpful, professional, precise, and polite. Keep your responses medium-to-short in length, concise and to the point, unless the user explicitly asks for a long, detailed, or comprehensive answer. Format your responses using Markdown for clarity."
    };

    // If using Pro model and thinking is enabled, add thinking budget
    if (modelType === ModelType.PRO && enableThinking) {
      config.thinkingConfig = { thinkingBudget: 2048 }; // Moderate budget for general reasoning
    }

    // 3. Create chat session
    const chat: Chat = ai.chats.create({
      model: modelType,
      history: history,
      config: config
    });

    // 4. Send message and stream response
    const resultStream = await chat.sendMessageStream({
      message: lastMessage.content
    });

    for await (const chunk of resultStream) {
      const responseChunk = chunk as GenerateContentResponse;
      if (responseChunk.text) {
        onChunk(responseChunk.text);
      }
    }

    onComplete();

  } catch (error) {
    console.error("Gemini API Error:", error);
    onError(error instanceof Error ? error : new Error("Unknown error occurred"));
  }
};