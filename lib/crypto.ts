/**
 * Cryptographic Verification Module for BlindBuild
 * Generates and validates tamper-evident HMAC-SHA256 signatures over verified stats payloads.
 */

import crypto from "crypto";

const DEFAULT_SECRET = process.env.BLINDBUILD_HMAC_SECRET || "blindbuild_campus_venture_incubator_2025_secret_salt_99";

export interface CanonicalStatsPayload {
  builderNumber: string;
  topLanguage: string;
  percentileRank: number;
  contributionsCount: number;
  hackathonWinsCount: number;
  hasVerifiedMLRepo: boolean;
}

/**
 * Builds deterministic canonical string representation for hashing
 */
export function buildCanonicalStatsString(payload: CanonicalStatsPayload): string {
  return [
    `builder=${payload.builderNumber.trim()}`,
    `lang=${payload.topLanguage.trim()}`,
    `percentile=${payload.percentileRank}`,
    `contributions=${payload.contributionsCount}`,
    `hackathons=${payload.hackathonWinsCount}`,
    `ml_verified=${payload.hasVerifiedMLRepo ? "1" : "0"}`
  ].join("&");
}

/**
 * Computes HMAC-SHA256 signature over canonical payload
 */
export function signStatsPayload(payload: CanonicalStatsPayload, secret: string = DEFAULT_SECRET): string {
  const canonical = buildCanonicalStatsString(payload);
  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

/**
 * Verifies if an existing signature matches the re-computed signature
 */
export function verifyStatsSignature(
  payload: CanonicalStatsPayload,
  signature: string,
  secret: string = DEFAULT_SECRET
): {
  isValid: boolean;
  computedSignature: string;
  canonicalString: string;
} {
  const canonicalString = buildCanonicalStatsString(payload);
  const computedSignature = crypto.createHmac("sha256", secret).update(canonicalString).digest("hex");
  const isValid = computedSignature === signature.trim();
  return { isValid, computedSignature, canonicalString };
}
