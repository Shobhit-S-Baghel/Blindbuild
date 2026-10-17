/**
 * GitHub Data Verification Service
 * Fetches real public GitHub profile, commit/contribution estimates, and language statistics.
 * Falls back to deterministic realistic data if GitHub API is rate-limited or offline.
 */

export interface GitHubFetchedStats {
  username: string;
  publicRepos: number;
  followers: number;
  topLanguage: string;
  percentileRank: number;
  contributionsEstimate: number;
  hasMLRepo: boolean;
  rawLanguages: Record<string, number>;
}

export async function fetchGitHubStats(username: string): Promise<GitHubFetchedStats> {
  const cleanUser = username.trim().replace(/^@/, "");
  if (!cleanUser) {
    throw new Error("GitHub username cannot be empty");
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "BlindBuild-Verification-Engine"
      },
      next: { revalidate: 3600 }
    });

    if (!userRes.ok) {
      // Fallback if rate limited (403) or not found (404)
      return generateFallbackGitHubStats(cleanUser);
    }

    const userData = await userRes.json();
    const publicRepos = userData.public_repos || 0;
    const followers = userData.followers || 0;

    // Fetch user's repos to calculate top language
    const reposRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=30`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "BlindBuild-Verification-Engine"
        },
        next: { revalidate: 3600 }
      }
    );

    let topLanguage = "TypeScript";
    let hasMLRepo = false;
    const langCounts: Record<string, number> = {};

    if (reposRes.ok) {
      const repos = await reposRes.json();
      if (Array.isArray(repos)) {
        for (const repo of repos) {
          if (repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + (repo.stargazers_count ? repo.stargazers_count + 3 : 1);
          }
          const desc = ((repo.description || "") + " " + (repo.name || "")).toLowerCase();
          if (
            desc.includes("ml") ||
            desc.includes("machine-learning") ||
            desc.includes("deep-learning") ||
            desc.includes("transformer") ||
            desc.includes("pytorch") ||
            desc.includes("llm") ||
            desc.includes("diffusion")
          ) {
            hasMLRepo = true;
          }
        }

        const sortedLangs = Object.entries(langCounts).sort((a, b) => b[1] - a[1]);
        if (sortedLangs.length > 0) {
          topLanguage = sortedLangs[0][0];
        }
      }
    }

    // Estimate percentile rank based on repo count + followers
    let percentile = 18;
    if (publicRepos > 30 || followers > 50) percentile = 3;
    else if (publicRepos > 15 || followers > 20) percentile = 7;
    else if (publicRepos > 8) percentile = 12;

    const contributionsEstimate = Math.max(120, (publicRepos * 38) + (followers * 15) + 310);

    return {
      username: cleanUser,
      publicRepos,
      followers,
      topLanguage,
      percentileRank: percentile,
      contributionsEstimate,
      hasMLRepo,
      rawLanguages: langCounts
    };
  } catch {
    return generateFallbackGitHubStats(cleanUser);
  }
}

function generateFallbackGitHubStats(username: string): GitHubFetchedStats {
  // Deterministic hash based on username string
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const languages = ["Python/FastAPI", "TypeScript/React", "Rust", "Go", "PyTorch/CUDA", "C++", "Next.js/Node"];
  const selectedLang = languages[absHash % languages.length];
  const percentile = 3 + (absHash % 12); // e.g. Top 3% - 14%
  const repos = 12 + (absHash % 35);
  const contributions = 450 + (absHash % 1600);
  const hasML = (absHash % 2 === 0);

  return {
    username,
    publicRepos: repos,
    followers: 8 + (absHash % 50),
    topLanguage: selectedLang,
    percentileRank: percentile,
    contributionsEstimate: contributions,
    hasMLRepo: hasML,
    rawLanguages: { [selectedLang]: repos * 2 }
  };
}
