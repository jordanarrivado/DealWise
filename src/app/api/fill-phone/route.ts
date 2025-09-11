import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o"; // use a supported model
const apiKey = process.env.GITHUB_TOKEN; // you only need 1 key

export async function POST(req: NextRequest) {
  try {
    const { phoneName } = await req.json();

    if (!phoneName) {
      return NextResponse.json({ error: "Phone name is required" }, { status: 400 });
    }

    // Prompt for autofilling phone specs
    const prompt = `
Product name: ${phoneName}
Provide all the following info; it must be strictly real. If it doesn't have data, make your best judgement based on specs.
Return in JSON strictly:
{
  "gamingScore": number (1-10),
  "antutu": number,
  "camera": string,
  "battery": string,
  "display": string,
  "chipset": string
}`;

    const client = new OpenAI({ baseURL: endpoint, apiKey });

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant for phone specifications." },
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
  } catch (err: unknown) {
    console.error("Autofill error:", err);

    let message = "Server error";
    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
