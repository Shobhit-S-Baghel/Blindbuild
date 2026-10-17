import { NextRequest, NextResponse } from "next/server";
import { generateArchitectureBlueprint, generateDirectBlueprint, checkOriginalityAndDuplicates } from "@/lib/gemini";
import { getProjects } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { history, initialIdea, title, pitch, techStack } = body;

    let blueprint;
    if (title || pitch) {
      blueprint = await generateDirectBlueprint(title || "Campus Venture", pitch || initialIdea || "", techStack);
    } else {
      blueprint = await generateArchitectureBlueprint(history || [], initialIdea || "Campus Project");
    }

    const existing = getProjects();
    const originality = await checkOriginalityAndDuplicates(blueprint.title, blueprint.oneLinePitch, existing);

    return NextResponse.json({
      blueprint,
      originality,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to synthesize blueprint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
