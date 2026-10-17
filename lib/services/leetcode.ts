/**
 * LeetCode Service Interface
 * Mocked with realistic data behind a clean service interface
 * Ready to be swapped with official or GraphQL endpoint.
 */

export interface LeetCodeStats {
  username: string;
  solvedCount: number;
  contestRating: number;
  ranking: string;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
}

export async function verifyLeetCode(username: string): Promise<LeetCodeStats> {
  const cleanUser = username.trim().replace(/^@/, "");
  if (!cleanUser) {
    return {
      username: "",
      solvedCount: 0,
      contestRating: 0,
      ranking: "Unranked",
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0
    };
  }

  // Deterministic realistic generator
  let hash = 0;
  for (let i = 0; i < cleanUser.length; i++) {
    hash = (hash << 5) - hash + cleanUser.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);

  const solved = 220 + (abs % 450); // e.g. 220 - 670 solved
  const hard = Math.floor(solved * 0.18);
  const medium = Math.floor(solved * 0.55);
  const easy = solved - hard - medium;
  const rating = 1750 + (abs % 500); // 1750 - 2250 Knight/Guardian
  const ranking = rating > 2000 ? "Guardian (Top 1.5%)" : "Knight (Top 4.8%)";

  return {
    username: cleanUser,
    solvedCount: solved,
    contestRating: rating,
    ranking,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard
  };
}
