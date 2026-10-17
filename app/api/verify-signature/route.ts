import { NextRequest, NextResponse } from "next/server";
import { verifyStatsSignature, CanonicalStatsPayload } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { payload, signature } = body as {
      payload: CanonicalStatsPayload;
      signature: string;
    };

    if (!payload || !signature) {
      return NextResponse.json({ error: "Payload and signature are required" }, { status: 400 });
    }

    const verification = verifyStatsSignature(payload, signature);

    return NextResponse.json({
      success: true,
      isValid: verification.isValid,
      computedSignature: verification.computedSignature,
      providedSignature: signature,
      canonicalString: verification.canonicalString,
      algorithm: "HMAC-SHA256",
      verifiedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Verification error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
