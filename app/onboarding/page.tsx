"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { VerifiedStatsCard } from "@/components/VerifiedStatsCard";
import { AnonymousBuilder } from "@/types";
import {
  ShieldCheck,
  Github,
  Code2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  Lock,
} from "lucide-react";

export default function OnboardingPage() {
  const { setCurrentBuilder, addToast, demoMode } = useApp();

  // Form states
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [scholarUrl, setScholarUrl] = useState("");
  const [hackathonDeclared, setHackathonDeclared] = useState("ETHIndia '24 Finalist, Smart India Hackathon Winner");

  // Private identity fields (Strictly vaulted server-side)
  const [realName, setRealName] = useState("");
  const [college, setCollege] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("2nd Year B.Tech");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [generatedBuilder, setGeneratedBuilder] = useState<AnonymousBuilder | null>(null);

  // Demo prefill helper
  const handlePrefillDemo = (profileType: "ML" | "SYSTEMS") => {
    if (profileType === "ML") {
      setGithubUsername("alex-vance-ai");
      setLeetcodeUsername("alex_ml");
      setScholarUrl("https://scholar.google.com/citations?user=ml_sample_409");
      setHackathonDeclared("NeurIPS AI Sprint Winner, HackMIT '24");
      setRealName("Alexander Vance");
      setCollege("Ashoka University");
      setYearOfStudy("2nd Year B.Sc");
      setEmail("alex.vance@ashoka.edu.in");
      setWhatsapp("+91 98765 43210");
      setLinkedinUrl("https://linkedin.com/in/alex-vance-ml");
    } else {
      setGithubUsername("torvalds");
      setLeetcodeUsername("linux_god");
      setHackathonDeclared("Kernel Con Global, BITS Hackathon 1st");
      setRealName("Rahul Sharma");
      setCollege("IIT Delhi");
      setYearOfStudy("1st Year B.Tech");
      setEmail("rahul.sharma@iitd.ac.in");
      setWhatsapp("+91 98712 34567");
      setLinkedinUrl("https://linkedin.com/in/rahulsharma-builds");
    }
    addToast({
      title: "Demo Profile Loaded",
      description: `Loaded sample credentials for ${profileType === "ML" ? "ML Specialist" : "Systems Engineer"}`,
      type: "info",
    });
  };

  const handleVerifyAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      addToast({
        title: "GitHub Required",
        description: "Please enter your GitHub handle to fetch public contributions and languages.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const hackathons = hackathonDeclared
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/builders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubUsername,
          leetcodeUsername,
          scholarUrl,
          declaredHackathons: hackathons,
          realName,
          college,
          yearOfStudy,
          email,
          whatsapp,
          linkedinUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to onboard");
      }

      setGeneratedBuilder(data.builder);
      setCurrentBuilder(data.builder);

      addToast({
        title: "Anonymous Identity Created!",
        description: `You are now ${data.builder.builderNumber}. Cryptographic HMAC-SHA256 signature generated.`,
        type: "success",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error verifying stats";
      addToast({
        title: "Verification Failed",
        description: message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-BIAS ONBOARDING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Generate Your Verified Stats Card
        </h1>
        <p className="text-sm text-gray-400">
          Your name, photo, and batch year remain sealed in a private vault until mutual project audition approval. Only your real code and metrics are published.
        </p>

        {/* Demo Mode Prefill Bar */}
        {demoMode && (
          <div className="pt-2 flex items-center justify-center space-x-2">
            <span className="text-xs font-mono text-amber-300 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Demo Fast-Fill:
            </span>
            <button
              type="button"
              onClick={() => handlePrefillDemo("SYSTEMS")}
              className="px-3 py-1 rounded-md text-xs font-mono bg-surface-200 border border-white/10 text-gray-200 hover:text-electric-cyan hover:border-electric-cyan/40 transition-colors"
            >
              1st-Year Systems Prodigy
            </button>
            <button
              type="button"
              onClick={() => handlePrefillDemo("ML")}
              className="px-3 py-1 rounded-md text-xs font-mono bg-surface-200 border border-white/10 text-gray-200 hover:text-electric-violet hover:border-electric-violet/40 transition-colors"
            >
              AI & Research Engineer
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORM COLUMN */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 space-y-6">
          <form onSubmit={handleVerifyAndGenerate} className="space-y-6">
            {/* PUBLIC TECHNICAL CREDENTIALS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-electric-cyan uppercase tracking-wider flex items-center gap-1.5">
                  <Code2 className="w-4 h-4" />
                  1. Public Technical Handles (Verified by Engine)
                </span>
                <span className="text-[10px] font-mono text-gray-400">Published Anonymously</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  GitHub Username <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Github className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={githubUsername}
                    onChange={(e) => setGithubUsername(e.target.value)}
                    placeholder="e.g. torvalds, gaearon, or your github username"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                  />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Engine fetches real public commit history, language distribution, and repository metadata via GitHub API.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    LeetCode Username <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    placeholder="e.g. algorithm_ninja"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">
                    Google Scholar Link <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={scholarUrl}
                    onChange={(e) => setScholarUrl(e.target.value)}
                    placeholder="https://scholar.google.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Hackathon Track Record (Comma-separated)
                </label>
                <input
                  type="text"
                  value={hackathonDeclared}
                  onChange={(e) => setHackathonDeclared(e.target.value)}
                  placeholder="e.g. ETHIndia Finalist, Smart India Hackathon Winner"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>

            {/* PRIVATE IDENTITY (SEALED IN VAULT) */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  2. Private Identity (Held in Encrypted Vault)
                </span>
                <span className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Locked until Mutual Match
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Full Legal Name</label>
                  <input
                    type="text"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">College / University</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. IIT Delhi, BITS Pilani"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">Year of Study</label>
                  <input
                    type="text"
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    placeholder="e.g. 1st Year B.Tech"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">WhatsApp / Phone</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+91 98712 34567"
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs tracking-wide uppercase hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting GitHub & Computing HMAC-SHA256...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Code & Generate Anonymous Card</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* PREVIEW / GENERATED CARD COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              {generatedBuilder ? "Live Verified Identity" : "Sample Stats Card Preview"}
            </span>
            <span className="text-[11px] font-mono text-electric-cyan">
              {generatedBuilder ? "ACTIVE" : "PREVIEW"}
            </span>
          </div>

          {generatedBuilder ? (
            <VerifiedStatsCard stats={generatedBuilder.stats} />
          ) : (
            <div className="space-y-4">
              <VerifiedStatsCard
                stats={{
                  builderNumber: "Builder #409",
                  topLanguage: "Python/FastAPI",
                  percentileRank: 4,
                  contributionsCount: 1420,
                  publicReposCount: 28,
                  hackathonWins: {
                    count: 3,
                    tags: ["ETHIndia '24 Finalist", "Smart India Hackathon 1st"],
                    verified: true,
                  },
                  hasVerifiedMLRepo: true,
                  leetCodeStats: {
                    solvedCount: 480,
                    contestRating: 1980,
                    ranking: "Knight (Top 4.2%)",
                  },
                  cryptographicSignature:
                    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                  identiconSeed: "409",
                }}
              />

              <div className="p-4 rounded-xl bg-surface-50/60 border border-white/5 text-xs text-gray-400 space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-electric-cyan" />
                  Tamper-Evident HMAC Proof
                </div>
                <p>
                  Every stats card carries a 256-bit hash. Click &quot;Cryptographically Verified&quot; or &quot;Inspect Proof&quot; on the card to inspect canonical fields and test live recomputation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
