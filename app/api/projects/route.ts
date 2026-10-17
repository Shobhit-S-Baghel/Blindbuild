import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProject, logGuardrailEvent } from "@/lib/db";
import { checkOriginalityAndDuplicates } from "@/lib/gemini";
import { Project } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skill = searchParams.get("skill");
  let projects = getProjects();

  if (skill) {
    const cleanSkill = skill.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.techStack.some((t) => t.toLowerCase().includes(cleanSkill)) ||
        p.roles.some((r) => r.skills.some((s) => s.toLowerCase().includes(cleanSkill)))
    );
  }

  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      posterId,
      posterNumber,
      title,
      oneLinePitch,
      techStack,
      diagramMermaid,
      roles,
      totalEstHours,
      risks,
      stressTestSummary,
    } = body;

    if (!title || !oneLinePitch) {
      return NextResponse.json({ error: "Title and pitch are required" }, { status: 400 });
    }

    const existingProjects = getProjects();

    // Run Autonomous AI Guardrail check for Originality & Duplicates
    const originalityScore = await checkOriginalityAndDuplicates(title, oneLinePitch, existingProjects);

    // If near duplicate is severe (>75% similarity), block publication!
    if (originalityScore.nearDuplicateMatch && originalityScore.nearDuplicateMatch.similarityPercent > 70) {
      logGuardrailEvent({
        actionType: "IDEA_ORIGINALITY",
        builderNumber: posterNumber || "Anonymous",
        inputSnippet: `${title}: ${oneLinePitch.slice(0, 60)}...`,
        verdict: "BLOCKED",
        reason: `Blocked by Guardrail: High collision (${originalityScore.nearDuplicateMatch.similarityPercent}%) with existing project "${originalityScore.nearDuplicateMatch.matchedTitle}".`,
        score: originalityScore.score,
        blockedDetails: [originalityScore.nearDuplicateMatch.reason],
      });

      return NextResponse.json(
        {
          blocked: true,
          reason: `Blocked by Guardrail: This idea closely duplicates "${originalityScore.nearDuplicateMatch.matchedTitle}". BlindBuild incubates differentiated ventures. Please explore an alternative technical angle!`,
          originality: originalityScore,
        },
        { status: 409 }
      );
    }

    const newProject: Project = {
      id: `proj-${Date.now().toString().slice(-4)}`,
      posterId: posterId || "b-409",
      posterNumber: posterNumber || "Builder #409",
      title,
      oneLinePitch,
      techStack: techStack || ["Next.js", "Python", "Docker"],
      diagramMermaid:
        diagramMermaid ||
        `graph TD\n  Client[Next.js Client] --> API[FastAPI Gateway]\n  API --> DB[(PostgreSQL)]`,
      roles: roles || [
        {
          id: `role-${Date.now()}-1`,
          title: "Fullstack Systems Engineer",
          skills: ["TypeScript", "Python"],
          minStats: "Top 10% in Top Language",
          estHours: 12,
          status: "OPEN",
        },
      ],
      totalEstHours: totalEstHours || 36,
      risks: risks || ["Distributed state reconciliation"],
      stressTestSummary: stressTestSummary || "Stress tested for campus hackathon sprint.",
      originality: originalityScore,
      createdAt: new Date().toISOString(),
    };

    saveProject(newProject);

    // Log to Guardrail
    logGuardrailEvent({
      actionType: "IDEA_ORIGINALITY",
      builderNumber: newProject.posterNumber,
      inputSnippet: `${newProject.title}: ${newProject.oneLinePitch.slice(0, 60)}...`,
      verdict: originalityScore.nearDuplicateMatch ? "WARNING" : "PASS",
      reason: originalityScore.summary,
      score: originalityScore.score,
    });

    return NextResponse.json({
      success: true,
      project: newProject,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to publish project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
