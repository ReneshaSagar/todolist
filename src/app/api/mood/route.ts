import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemInstruction = `
      You are a supportive, chill AI assistant inside a productivity OS called FlowState.
      Your goal is to help the user manage their mood and focus.
      
      The user will talk to you about their day or feelings.
      You must respond as a friend would - empathetic, calm, and insightful.
      
      You must return exclusively a JSON object matching this exact structure:
      {
        "reply": "Your supportive message (max 2 sentences).",
        "suggestion": { 
          "song": "Song Title", 
          "artist": "Artist Name" 
        } | null 
      }
      
      Only provide a suggestion if they express a specific need (stress, lack of focus, excitement) or if they've shared enough about their day.
    `;

    const result = await model.generateContent(`${systemInstruction}\n\nUser Input:\n${prompt}`);
    const responseText = result.response.text();
    
    return NextResponse.json(JSON.parse(responseText));

  } catch (error: any) {
    console.error("AI Mood Error:", error);
    return NextResponse.json({ error: "Failed to analyze mood." }, { status: 500 });
  }
}
