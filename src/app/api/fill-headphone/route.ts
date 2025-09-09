// app/api/autofill/headphone/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o"; 
const apiKey = process.env.GITHUB_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const { headphoneName } = await req.json();

    if (!headphoneName) {
      return NextResponse.json({ error: "Headphone name is required" }, { status: 400 });
    }

    const prompt = `
      Product name: ${headphoneName}
      Provide all the following info; it must be real. If unknown, make your best judgement based on specs.
      Return strictly in JSON format:

      {
        "type": string,             
        "connectivity": string,  
        "impedance": number,        
        "frequencyResponse": string,
        "overallScore" : number (1-10)        
      }`;

    const client = new OpenAI({ baseURL: endpoint, apiKey });

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant for headphone specifications." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || "{}";

    let specs;
    try {
      specs = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      specs = match ? JSON.parse(match[0]) : {};
    }

    return NextResponse.json(specs);
  } catch (err: any) {
    console.error("Autofill error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
