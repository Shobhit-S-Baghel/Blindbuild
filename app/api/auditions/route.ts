import { NextRequest, NextResponse } from "next/server";
import { getAuditions, saveAudition, getProjectById, getBuilderById, logGuardrailEvent } from "@/lib/db";
import { generateAuditionQuestion, gradeAuditionAnswer, moderateMessage } from "@/lib/gemini";
import { Audition } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const builderId = searchParams.get("builderId") || undefined;
  const auditions = getAuditions(builderId);
  return NextResponse.json({ auditions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "GENERATE_QUESTION" || action === "SUGGEST_QUESTION") {
      const { roleTitle, projectTitle, techStack } = body;
      const question = await generateAuditionQuestion(
        roleTitle || "Software Engineer",
        projectTitle || "Campus Venture",
        techStack || ["Python", "TypeScript"]
      );
      return NextResponse.json({ question });
    }

    if (action === "SUBMIT_AUDITION") {
      const {
        projectId,
        roleId,
        roleTitle,
        applicantId,
        applicantNumber,
        auditionType,
        questionText,
        applicantAnswer,
      } = body;

      if (!applicantAnswer || !applicantAnswer.trim()) {
        return NextResponse.json({ error: "Answer or GitHub link cannot be empty" }, { status: 400 });
      }

      // Check contact leak in audition submission!
      const modCheck = await moderateMessage(applicantAnswer);
      if (!modCheck.allowed) {
        logGuardrailEvent({
          actionType: "MESSAGE_CONTACT_LEAK",
          builderNumber: applicantNumber || "Applicant",
          inputSnippet: applicantAnswer.slice(0, 60),
          verdict: "BLOCKED",
          reason: "Contact leak attempt detected inside audition response.",
          blockedDetails: modCheck.detectedPatterns,
        });

        return NextResponse.json(
          {
            blocked: true,
            reason: "Blocked by Guardrail: contact info or personal links are locked until mutual match. Please keep the audition purely technical!",
            details: modCheck.detectedPatterns,
          },
          { status: 403 }
        );
      }

      // Grade the audition using Gemini
      const grade = await gradeAuditionAnswer(questionText, applicantAnswer, roleTitle);

      const applicantBuilder = getBuilderById(applicantId);
      const project = getProjectById(projectId);

      const audition: Audition = {
        id: `aud-${Date.now().toString().slice(-5)}`,
        projectId,
        projectTitle: project?.title || "Campus Project",
        roleId,
        roleTitle,
        applicantId: applicantId || "b-current",
        applicantNumber: applicantNumber || "Builder #Applicant",
        applicantStats: applicantBuilder?.stats || {
          builderNumber: applicantNumber || "Builder #Applicant",
          topLanguage: "TypeScript",
          percentileRank: 6,
          contributionsCount: 1100,
          publicReposCount: 14,
          hackathonWins: { count: 1, tags: ["Hackathon Finalist"], verified: true },
          hasVerifiedMLRepo: false,
          cryptographicSignature: "verified",
          identiconSeed: "123",
        },
        auditionType: auditionType || "QUESTION",
        questionText: questionText || "Architectural assessment",
        applicantAnswer,
        score: grade.score,
        feedback: grade.feedback,
        passed: grade.passed,
        posterApproved: false,
        applicantApproved: true, // Applicant submitting indicates interest
        status: "AWAITING_APPROVAL",
        createdAt: new Date().toISOString(),
      };

      saveAudition(audition);

      logGuardrailEvent({
        actionType: "AUDITION_SUBMISSION",
        builderNumber: audition.applicantNumber,
        inputSnippet: `${roleTitle}: Score ${grade.score}/100`,
        verdict: grade.passed ? "PASS" : "WARNING",
        reason: grade.feedback,
        score: grade.score,
      });

      return NextResponse.json({
        success: true,
        audition,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process audition";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
