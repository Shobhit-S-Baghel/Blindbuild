"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Project, Audition } from "@/types";
import { VerifiedStatsCard } from "@/components/VerifiedStatsCard";
import { Identicon } from "@/components/Identicon";
import { RevealUnlockModal } from "@/components/RevealUnlockModal";
import {
  UserCheck,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Unlock,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const { currentBuilder, addToast, demoMode } = useApp();

  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "MY_PROJECTS" | "STATS_CARD">("APPLICATIONS");
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [myAuditions, setMyAuditions] = useState<Audition[]>([]);
  const [loading, setLoading] = useState(true);

  // Reveal Modal State
  const [selectedRevealAudition, setSelectedRevealAudition] = useState<Audition | null>(null);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load projects
      const pRes = await fetch("/api/projects");
      if (pRes.ok) {
        const pData = await pRes.json();
        const allProjects: Project[] = pData.projects || [];
        // Filter projects posted by current builder (or show sample projects if builder matches)
        const myP = allProjects.filter(
          (p) => p.posterNumber === currentBuilder?.builderNumber || p.posterId === currentBuilder?.id
        );
        setMyProjects(myP.length > 0 ? myP : [allProjects[0]]);
      }

      // 2. Load auditions
      const aRes = await fetch("/api/auditions");
      if (aRes.ok) {
        const aData = await aRes.json();
        setMyAuditions(aData.auditions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentBuilder]);

  const handleApprove = async (auditionId: string, party: "POSTER" | "APPLICANT") => {
    setApprovingId(auditionId);
    try {
      const res = await fetch(`/api/auditions/${auditionId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ party }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Approval failed");
      }

      // Update local state
      setMyAuditions((prev) =>
        prev.map((item) => (item.id === auditionId ? data.audition : item))
      );

      if (data.newlyRevealed || data.audition.status === "REVEALED") {
        setSelectedRevealAudition(data.audition);
        setShowRevealModal(true);
        addToast({
          title: "Double-Opt-In Complete!",
          description: "Both sides approved. Vault decrypted; real identities and pod workspace unlocked!",
          type: "success",
        });
      } else {
        addToast({
          title: "Approved!",
          description: "Waiting for mutual approval from other party to unlock identities.",
          type: "info",
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Approval failed";
      addToast({
        title: "Action Error",
        description: message,
        type: "error",
      });
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center space-x-3.5">
          <Identicon seed={currentBuilder?.stats.identiconSeed || currentBuilder?.builderNumber || "409"} size={52} />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold font-mono text-white">
                {currentBuilder?.builderNumber || "Builder #409"}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30">
                Active Persona
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-0.5">
              Top {currentBuilder?.stats.percentileRank}% {currentBuilder?.stats.topLanguage} •{" "}
              {currentBuilder?.stats.contributionsCount} Commits • Double-Blind Escrow
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/post-idea"
            className="px-4 py-2 rounded-xl bg-electric-cyan text-black font-semibold text-xs font-mono hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post New Idea</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "APPLICATIONS"
              ? "bg-surface-200 text-electric-cyan font-bold border border-electric-cyan/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Applications & Handshakes ({myAuditions.length})
        </button>

        <button
          onClick={() => setActiveTab("MY_PROJECTS")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "MY_PROJECTS"
              ? "bg-surface-200 text-electric-cyan font-bold border border-electric-cyan/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          My Posted Blueprints ({myProjects.length})
        </button>

        <button
          onClick={() => setActiveTab("STATS_CARD")}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === "STATS_CARD"
              ? "bg-surface-200 text-electric-cyan font-bold border border-electric-cyan/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Verified Cryptographic Stats Card
        </button>
      </div>

      {/* TAB 1: APPLICATIONS & MUTUAL HANDSHAKES */}
      {activeTab === "APPLICATIONS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>MUTUAL APPROVAL HANDSHAKES</span>
            <span>Server Gatekeeper Active</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs font-mono text-gray-400">Loading handshakes...</div>
          ) : myAuditions.length === 0 ? (
            <div className="p-12 rounded-2xl glass-panel border border-white/10 text-center font-mono text-xs text-gray-400 space-y-2">
              <div>No active auditions found. Join a project from the feed to start an audition!</div>
              <Link href="/projects" className="text-electric-cyan underline block">
                Browse Projects →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {myAuditions.map((audition) => {
                const isRevealed = audition.status === "REVEALED";
                const isPoster = currentBuilder?.builderNumber === "Builder #409";
                const hasIApproved = isPoster ? audition.posterApproved : audition.applicantApproved;

                return (
                  <div
                    key={audition.id}
                    className={`p-6 rounded-2xl glass-panel border transition-all ${
                      isRevealed
                        ? "border-emerald-500/40 bg-[#09161a] shadow-glow-cyan/20"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isRevealed
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            STATUS: {audition.status}
                          </span>
                          <span className="text-xs font-mono text-gray-400">
                            Audition ID: {audition.id}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {audition.projectTitle}
                        </h3>
                        <p className="text-xs font-mono text-electric-cyan mt-0.5">
                          Role: {audition.roleTitle}
                        </p>
                      </div>

                      {/* Technical Score Chip */}
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-surface-100 border border-white/10 text-right">
                          <div className="text-[10px] font-mono text-gray-400">GEMINI SCORE</div>
                          <div className="text-xl font-extrabold font-mono text-electric-cyan">
                            {audition.score}/100
                          </div>
                        </div>

                        {/* If already revealed, button to view identities */}
                        {isRevealed && (
                          <button
                            onClick={() => {
                              setSelectedRevealAudition(audition);
                              setShowRevealModal(true);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold text-xs font-mono hover:bg-emerald-400 transition-all flex items-center space-x-1.5 shadow-glow-emerald"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                            <span>View Unlocked Workspace</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Audition Details & Transcript */}
                    <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-1.5">
                        <span className="text-gray-400">Architectural Challenge:</span>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-gray-200 text-[11px] leading-relaxed">
                          {audition.questionText}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-gray-400">Candidate Submission:</span>
                        <div className="p-3 rounded-xl bg-black/50 border border-white/5 text-gray-200 text-[11px] leading-relaxed">
                          {audition.applicantAnswer}
                        </div>
                      </div>
                    </div>

                    {/* Double-Opt-In Approval Action Bar */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 text-xs font-mono">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-gray-400">Founder Approved:</span>
                          <span
                            className={
                              audition.posterApproved
                                ? "text-emerald-400 font-bold"
                                : "text-amber-400"
                            }
                          >
                            {audition.posterApproved ? "YES ✓" : "PENDING"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1.5">
                          <span className="text-gray-400">Applicant Approved:</span>
                          <span
                            className={
                              audition.applicantApproved
                                ? "text-emerald-400 font-bold"
                                : "text-amber-400"
                            }
                          >
                            {audition.applicantApproved ? "YES ✓" : "PENDING"}
                          </span>
                        </div>
                      </div>

                      {/* Approval Buttons */}
                      {!isRevealed && (
                        <div className="flex items-center space-x-2">
                          {/* Poster approve button */}
                          <button
                            onClick={() => handleApprove(audition.id, "POSTER")}
                            disabled={approvingId === audition.id || audition.posterApproved}
                            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                              audition.posterApproved
                                ? "bg-surface-200 text-gray-400 cursor-not-allowed border border-white/5"
                                : "bg-electric-cyan text-black font-semibold hover:bg-cyan-300 shadow-glow-cyan"
                            }`}
                          >
                            {audition.posterApproved ? "Founder Approved ✓" : "Approve as Founder"}
                          </button>

                          {/* Applicant approve button */}
                          <button
                            onClick={() => handleApprove(audition.id, "APPLICANT")}
                            disabled={approvingId === audition.id || audition.applicantApproved}
                            className={`px-4 py-2 rounded-xl text-xs font-mono transition-all ${
                              audition.applicantApproved
                                ? "bg-surface-200 text-gray-400 cursor-not-allowed border border-white/5"
                                : "bg-electric-violet text-white font-semibold hover:bg-violet-400 shadow-glow-violet"
                            }`}
                          >
                            {audition.applicantApproved ? "Applicant Approved ✓" : "Approve as Applicant"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY POSTED BLUEPRINTS */}
      {activeTab === "MY_PROJECTS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myProjects.map((p) => (
              <div
                key={p.id}
                className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-electric-cyan">
                    ID: {p.id}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    Est: {p.totalEstHours}h
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">{p.title}</h3>
                <p className="text-xs text-gray-300 line-clamp-2">{p.oneLinePitch}</p>

                <div className="pt-2 flex items-center justify-between">
                  <Link
                    href={`/projects/${p.id}`}
                    className="text-xs font-mono text-electric-cyan hover:underline flex items-center gap-1"
                  >
                    <span>View Blueprint & Diagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <span className="text-xs font-mono text-emerald-400">
                    Novelty: {p.originality.score}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED STATS CARD */}
      {activeTab === "STATS_CARD" && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-white font-mono">
              Your Public Cryptographic Credential
            </h2>
            <p className="text-xs text-gray-400">
              This card is the ONLY thing visible to other founders and applicants across the platform.
            </p>
          </div>

          {currentBuilder ? (
            <VerifiedStatsCard stats={currentBuilder.stats} />
          ) : (
            <div className="p-8 text-center font-mono text-xs text-gray-400">
              No stats card linked.
            </div>
          )}
        </div>
      )}

      {/* Double-Opt-In Reveal Modal */}
      {selectedRevealAudition && (
        <RevealUnlockModal
          audition={selectedRevealAudition}
          isOpen={showRevealModal}
          onClose={() => setShowRevealModal(false)}
        />
      )}
    </div>
  );
}
