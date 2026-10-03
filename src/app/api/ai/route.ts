import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are Nexus AI, an intelligent, helpful, and friendly AI assistant powered by Google Gemini. Keep your answers concise, accurate, and format code with markdown backticks.`,
  architect: `You are a Principal Software Architect. Your job is to provide clean, modular, scalable architectural designs, database schemas, best practices, and production-grade code. Always explain trade-offs and include practical examples.`,
  prompter: `You are an expert AI Prompt Engineer. Analyze the user's intent and produce an optimized, structured prompt (with system instructions, constraints, input format, and output schema) that gets the best possible output from LLMs.`,
  summarizer: `You are an executive summarizer. Condense the user's input into: 1) Key Takeaways (bullet points), 2) Actionable Next Steps, and 3) Potential Risks or Considerations. Keep it sharp and impactful.`,
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode = "chat", customInstructions } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured on the server. Please set it in .env.local or Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction =
      customInstructions || SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.chat;

    const startTime = Date.now();
    
    // Primary model: gemini-3.5-flash-lite, fallback to gemini-3.8-flash if needed
    let modelName = "gemini-3.5-flash-lite";
    let response;

    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: mode === "architect" ? 0.3 : 0.7,
        },
      });
    } catch (primaryErr: unknown) {
      console.warn("Primary model error, attempting fallback...", primaryErr);
      modelName = "gemini-3.8-flash";
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
    }

    const durationMs = Date.now() - startTime;
    const text = response.text || "No response generated.";

    return NextResponse.json({
      success: true,
      text,
      model: modelName,
      mode,
      durationMs,
    });
  } catch (error: unknown) {
    console.error("Gemini API Route Error:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { error: `Gemini API Error: ${message}` },
      { status: 500 }
    );
  }
}
