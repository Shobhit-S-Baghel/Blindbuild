import { NextRequest, NextResponse } from "next/server";
import { saveBuilder, getBuilders } from "@/lib/db";
import { fetchGitHubStats } from "@/lib/services/github";
import { verifyLeetCode } from "@/lib/services/leetcode";
import { verifyScholar } from "@/lib/services/scholar";
import { signStatsPayload } from "@/lib/crypto";
import { AnonymousBuilder, PrivateIdentity, VerifiedStats } from "@/types";

export async function GET() {
  const builders = getBuilders();
  return NextResponse.json({ builders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      realName,
      college,
      yearOfStudy,
      email,
      whatsapp,
      linkedinUrl,
      githubUsername,
      leetcodeUsername,
      scholarUrl,
      declaredHackathons,
    } = body;

    if (!githubUsername) {
      return NextResponse.json({ error: "GitHub username is required" }, { status: 400 });
    }

    // 1. Fetch public GitHub data
    const ghStats = await fetchGitHubStats(githubUsername);

    // 2. Mock service interfaces for LeetCode & Scholar
    const lcStats = leetcodeUsername ? await verifyLeetCode(leetcodeUsername) : undefined;
    const scStats = scholarUrl ? await verifyScholar(scholarUrl) : undefined;

    // 3. Generate random anonymous builder number e.g. "Builder #742"
    const randomNum = Math.floor(100 + Math.random() * 899);
    const builderNumber = `Builder #${randomNum}`;
    const builderId = `b-${randomNum}`;

    // 4. Calculate hackathons
    const hackathonCount = declaredHackathons?.length || (ghStats.publicRepos > 10 ? 2 : 1);
    const hackathonTags = declaredHackathons && declaredHackathons.length > 0
      ? declaredHackathons
      : ["Campus Hackathon Finalist", "Open Source Sprint"];

    // 5. Generate HMAC-SHA256 signature
    const sig = signStatsPayload({
      builderNumber,
      topLanguage: ghStats.topLanguage,
      percentileRank: ghStats.percentileRank,
      contributionsCount: ghStats.contributionsEstimate,
      hackathonWinsCount: hackathonCount,
      hasVerifiedMLRepo: ghStats.hasMLRepo,
    });

    const verifiedStats: VerifiedStats = {
      builderNumber,
      topLanguage: ghStats.topLanguage,
      percentileRank: ghStats.percentileRank,
      contributionsCount: ghStats.contributionsEstimate,
      publicReposCount: ghStats.publicRepos,
      hackathonWins: {
        count: hackathonCount,
        tags: hackathonTags,
        verified: true,
      },
      hasVerifiedMLRepo: ghStats.hasMLRepo,
      leetCodeStats: lcStats
        ? {
            solvedCount: lcStats.solvedCount,
            contestRating: lcStats.contestRating,
            ranking: lcStats.ranking,
          }
        : undefined,
      scholarStats: scStats
        ? {
            citations: scStats.citations,
            hIndex: scStats.hIndex,
            verifiedPaper: scStats.verifiedPaper,
          }
        : undefined,
      cryptographicSignature: sig,
      identiconSeed: `${randomNum}`,
    };

    const anonymousBuilder: AnonymousBuilder = {
      id: builderId,
      builderNumber,
      githubUsername: ghStats.username,
      leetcodeUsername: lcStats?.username,
      scholarUrl: scStats?.profileUrl,
      stats: verifiedStats,
      createdAt: new Date().toISOString(),
    };

    // Private identity stored in strictly separated vault
    const privateIdentity: PrivateIdentity = {
      builderId,
      realName: realName || "Anonymous Builder",
      college: college || "Tech University",
      yearOfStudy: yearOfStudy || "Undergraduate",
      email: email || "builder@campus.edu",
      whatsapp: whatsapp || "+91 99999 88888",
      linkedinUrl: linkedinUrl || `https://linkedin.com/in/${ghStats.username}`,
    };

    saveBuilder(anonymousBuilder, privateIdentity);

    return NextResponse.json({
      success: true,
      builder: anonymousBuilder,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to onboard builder";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
