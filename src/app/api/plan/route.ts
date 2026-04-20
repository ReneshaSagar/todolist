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
    
    // We use gemini-1.5-flash for speed and JSON structure support.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemInstruction = `
      You are a super chill, lofi-style productivity assistant. You keep things calm, relaxed, yet incredibly organized.
      The user will give you a messy paragraph of their chores, tasks, and goals for the day.
      Your job is to optimize this schedule so hard things are tackled first (deep work), leaving easier tasks for later.
      
      You must return exclusively a JSON object matching this exact TypeScript structure:
      {
        "message": "A short, chill, and highly encouraging message explaining how you optimized their day (e.g., 'Yo, sounds like a busy one. I frontloaded the heavy math so you can vibe with gaming later. You got this.')",
        "tasks": [
          {
            "title": "Clear task name",
            "priority": "Low" | "Medium" | "High" | "Urgent",
            "tags": ["Focus", "Study"], /* 1-2 relevant single-word tags */
            "xp": 50 /* A number between 10 and 100 based on difficulty */
          }
        ]
      }
    `;

    const result = await model.generateContent(`${systemInstruction}\n\nUser Input:\n${prompt}`);
    const responseText = result.response.text();
    
    // Attempt to parse to ensure it's valid before sending it down.
    const jsonResponse = JSON.parse(responseText);

    return NextResponse.json(jsonResponse);

  } catch (error: any) {
    console.error("AI Planner Error:", error);
    return NextResponse.json({ error: "Failed to generate plan. Please try again." }, { status: 500 });
  }
}
