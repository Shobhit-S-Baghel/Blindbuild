import { NextRequest, NextResponse } from "next/server";
import { moderateMessage } from "@/lib/gemini";
import { logGuardrailEvent } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, builderNumber, context } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ allowed: true, reason: "Empty input" });
    }

    const result = await moderateMessage(text);

    // Always log to Guardrail Log so judges can see both passes & blocks in real time!
    logGuardrailEvent({
      actionType: result.riskLevel === "LEAK_DETECTED" ? "MESSAGE_CONTACT_LEAK" : "TOXICITY_CHECK",
      builderNumber: builderNumber || "Anonymous",
      inputSnippet: text.length > 70 ? text.slice(0, 67) + "..." : text,
      verdict: result.allowed ? "PASS" : "BLOCKED",
      reason: result.reason,
      blockedDetails: result.detectedPatterns,
    });

    return NextResponse.json({
      allowed: result.allowed,
      reason: result.reason,
      detectedPatterns: result.detectedPatterns,
      riskLevel: result.riskLevel,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Moderation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
