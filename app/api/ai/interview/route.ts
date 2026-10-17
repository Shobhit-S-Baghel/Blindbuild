import { NextRequest, NextResponse } from "next/server";
import { askNextInterviewQuestion } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history } = body;
    const result = await askNextInterviewQuestion(history || []);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate interview question";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
