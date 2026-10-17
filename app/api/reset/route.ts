import { NextResponse } from "next/server";
import { resetDatabaseToSeed } from "@/lib/db";

export async function POST() {
  resetDatabaseToSeed();
  return NextResponse.json({ success: true, message: "Database reset to pristine seed state." });
}
