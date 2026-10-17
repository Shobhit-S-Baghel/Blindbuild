"use client";

import React, { useState } from "react";
import { VerifiedStats } from "@/types";
import { Identicon } from "./Identicon";
import { SignatureVerifyModal } from "./SignatureVerifyModal";
import {
  ShieldCheck,
  GitCommit,
  Trophy,
  Cpu,
  Code2,
  ExternalLink,
  GraduationCap,
  Sparkles,
} from "lucide-react";

interface VerifiedStatsCardProps {
  stats: VerifiedStats;
  compact?: boolean;
  className?: string;
}

export function VerifiedStatsCard({ stats, compact = false, className = "" }: VerifiedStatsCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl glass-panel glass-card-hover border border-white/10 ${
          compact ? "p-4" : "p-6"
        } ${className}`}
      >
        {/* Glow corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-cyan/15 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <Identicon seed={stats.identiconSeed || stats.builderNumber} size={compact ? 42 : 52} />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-mono text-base font-bold tracking-tight text-white">
                  {stats.builderNumber}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30">
                  Verified
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Double-Blind Active
              </p>
            </div>
          </div>

          {/* Cryptographically Verified Chip (Clickable to open modal) */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg border border-electric-cyan/40 bg-electric-cyan/5 text-electric-cyan hover:bg-electric-cyan/20 transition-all shadow-glow-cyan/50"
            title="Click to inspect cryptographic HMAC signature proof"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-electric-cyan shrink-0" />
            <span className="hidden sm:inline">Cryptographically Verified</span>
            <span className="sm:hidden">HMAC</span>
          </button>
        </div>

        {/* Core Highlight: Percentile Rank in Top Language */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-surface-100 to-surface-50 border border-white/5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Validated Domain Benchmark
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-white flex items-center space-x-2">
                <span className="text-electric-cyan font-extrabold">
                  Top {stats.percentileRank}%
                </span>
                <span className="text-gray-300 font-sans text-sm sm:text-base font-medium">
                  {stats.topLanguage}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-200/80 border border-white/10 text-electric-cyan shadow-glow-cyan/20">
              <Code2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Metric Badges Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {/* Commit Contributions */}
          <div className="p-3 rounded-xl bg-surface-50/70 border border-white/5 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Contributions</div>
              <div className="font-mono text-sm font-semibold text-white">
                {stats.contributionsCount.toLocaleString()}+ commits
              </div>
            </div>
          </div>

          {/* Hackathon Track Record */}
          <div className="p-3 rounded-xl bg-surface-50/70 border border-white/5 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-gray-400">Hackathon Wins</div>
              <div className="font-mono text-sm font-semibold text-white flex items-center space-x-1">
                <span>{stats.hackathonWins.count} Wins</span>
                {stats.hackathonWins.verified && (
                  <span className="text-[10px] text-emerald-400 font-sans">✓</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Supplemental Badges: ML Repo, LeetCode, Scholar */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
          {stats.hasVerifiedMLRepo && (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-electric-violet/10 text-electric-violet border border-electric-violet/30 font-mono text-[11px] shadow-glow-violet/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Verified ML Repo</span>
            </div>
          )}

          {stats.leetCodeStats && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono text-[11px]">
              <Sparkles className="w-3 h-3" />
              <span>LeetCode {stats.leetCodeStats.ranking.split(" ")[0]} ({stats.leetCodeStats.solvedCount} solved)</span>
            </div>
          )}

          {stats.scholarStats && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono text-[11px]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Scholar ({stats.scholarStats.citations} citations)</span>
            </div>
          )}

          {stats.hackathonWins.tags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300 border border-white/5"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom Signature Hash Preview */}
        {!compact && (
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="truncate max-w-[200px]">
              SIG: {stats.cryptographicSignature.slice(0, 16)}...
            </span>
            <button
              onClick={() => setShowModal(true)}
              className="text-electric-cyan hover:underline flex items-center space-x-1 shrink-0"
            >
              <span>Inspect Proof</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureVerifyModal
        stats={stats}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}
