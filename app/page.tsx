"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Code2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  GitBranch,
  Cpu,
  Trophy,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Identicon } from "@/components/Identicon";

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Anti-Bias Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-xs font-mono mb-8 shadow-glow-cyan/40 animate-pulse-slow">
          <ShieldCheck className="w-4 h-4" />
          <span>Double-Blind Venture Incubator for College Campuses</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          Ideas and code speak first.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-cyan via-blue-400 to-electric-violet">
            Identity comes later.
          </span>
        </h1>

        {/* Subhead Problem Statement */}
        <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
          College venture networking is broken by batch-year prejudice, LinkedIn clout, and pedigree bias. BlindBuild replaces names and photos with cryptographically verified GitHub commits, LeetCode ratings, and algorithmic auditions.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/projects"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-electric-cyan text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center space-x-2 group"
          >
            <span>Explore Venture Feed</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/post-idea"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-100 hover:bg-surface-200 border border-white/10 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-electric-violet" />
            <span>Post Venture Idea</span>
          </Link>
        </div>

        {/* BEFORE VS AFTER BIAS COMPARISON (MANDATORY REQUIREMENT) */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
            THE CAMPUS NETWORK PROBLEM vs. THE BLINDBUILD FIX
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* The Broken Traditional Way */}
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/10">
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-mono font-bold">
                  <XCircle className="w-4 h-4" />
                  <span>TRADITIONAL CAMPUS CLIQUE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  REJECTED / IGNORED
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3 opacity-60">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-bold">
                    RS
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-300 text-sm">Rahul Sharma</h4>
                    <p className="text-xs text-rose-300">1st Year B.Tech (Freshman)</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 text-xs text-gray-400 font-sans space-y-1">
                  <p className="text-gray-300 font-medium">&quot;Can I join your hackathon team?&quot;</p>
                  <p className="text-rose-400/90 text-[11px]">
                    ↳ Dismissed without review: &quot;Sorry, we only team up with 3rd/4th years with 500+ LinkedIn connections.&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* The BlindBuild Way */}
            <div className="p-6 rounded-2xl bg-[#0b1b1f] border border-electric-cyan/40 relative overflow-hidden shadow-glow-cyan/20">
              <div className="flex items-center justify-between pb-4 border-b border-electric-cyan/15">
                <div className="flex items-center space-x-2 text-electric-cyan text-xs font-mono font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>BLINDBUILD VERIFIED ENGINE</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-electric-cyan/20 text-electric-cyan font-bold">
                  MUTUAL MATCH
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Identicon seed="409" size={48} />
                  <div>
                    <h4 className="font-mono font-bold text-white text-base">Builder #409</h4>
                    <p className="text-xs font-mono text-emerald-400 font-semibold">
                      Top 4% Python/FastAPI • 1,420 Commits
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-electric-cyan/20 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Cryptographic HMAC:</span>
                    <span className="text-emerald-400 font-bold">VALIDATED ✓</span>
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Verified ML Repo • 3 Hackathon Wins • Real public code speaks for itself.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP "HOW IT WORKS" SECTION */}
      <section className="py-20 border-t border-white/10 bg-surface-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-mono text-electric-cyan uppercase tracking-widest">
              Meritocracy by Architecture
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              How BlindBuild Works
            </h2>
            <p className="text-sm text-gray-400">
              Three strict phases designed to protect builders, eliminate noise, and forge elite founding teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan flex items-center justify-center font-mono font-bold mb-5 shadow-glow-cyan/30">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">
                Post Anonymously
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Founders post their idea, tech stack, and custom audition questions under an anonymous Builder #, with optional AI architecture suggestions and live Mermaid diagrams.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-electric-violet/10 border border-electric-violet/30 text-electric-violet flex items-center justify-center font-mono font-bold mb-5 shadow-glow-violet/30">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">
                Get Cryptographically Verified
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Applicants connect their GitHub, LeetCode, and publications. BlindBuild generates an HMAC-SHA256 signed Stats Card showing percentile rankings, commit volumes, and verified ML badges.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl glass-panel border border-white/10 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold mb-5">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-mono">
                Audition & Double Reveal
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Applicants take a 3-minute architectural timed audition graded by Gemini. Only when BOTH sides mutually approve does the vault unlock real identities and auto-provision the venture workspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUTONOMOUS GUARDRAIL HIGHLIGHT BANNER */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 rounded-3xl bg-gradient-to-r from-surface-100 via-surface-50 to-[#0e1424] border border-white/10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-electric-cyan/10 text-electric-cyan text-xs font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Autonomous AI Guardrails Active</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Zero Leaks. Zero Copycat Clones.
                </h3>
                <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                  Every publish and audition is guarded by a dual-tier pipeline: Regex pre-filters instantly intercept phone numbers, emails, and handles. Gemini AI inspects for subtle evasion and checks originality against all existing projects.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <Link
                  href="/projects"
                  className="px-6 py-3 rounded-xl bg-electric-cyan text-black font-semibold text-xs hover:bg-cyan-300 transition-all text-center shadow-glow-cyan"
                >
                  Browse Verified Projects
                </Link>
                <Link
                  href="/onboarding"
                  className="px-6 py-3 rounded-xl bg-surface-200 border border-white/10 text-white font-medium text-xs hover:bg-surface-300 transition-all text-center"
                >
                  Generate My Verified Stats Card
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
