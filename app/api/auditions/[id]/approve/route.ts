import { NextRequest, NextResponse } from "next/server";
import { approveAuditionByParty } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { party } = body; // "POSTER" | "APPLICANT"

    if (party !== "POSTER" && party !== "APPLICANT") {
      return NextResponse.json({ error: "party must be POSTER or APPLICANT" }, { status: 400 });
    }

    const { audition, newlyRevealed } = approveAuditionByParty(params.id, party);

    return NextResponse.json({
      success: true,
      audition,
      newlyRevealed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to approve audition";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
