"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Audition } from "@/types";
import {
  Unlock,
  Github,
  MessageSquare,
  ExternalLink,
  Mail,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

interface RevealUnlockModalProps {
  audition: Audition;
  isOpen: boolean;
  onClose: () => void;
}

export function RevealUnlockModal({ audition, isOpen, onClose }: RevealUnlockModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti blast
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#00f2fe", "#8b5cf6", "#10b981", "#ffffff"],
        });
      } catch {
        // fallback
      }
    }
  }, [isOpen]);

  if (!isOpen || !audition.revealedWorkspace) return null;

  const { posterIdentity, applicantIdentity, githubOrgUrl, discordInviteUrl } =
    audition.revealedWorkspace;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-electric-cyan/40 bg-[#090c16] shadow-glow-cyan text-white p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-300">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-electric-cyan/20 to-transparent blur-3xl pointer-events-none" />

        {/* Header: Mutual Validation Complete */}
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Unlock className="w-3.5 h-3.5" />
            <span>MUTUAL TECHNICAL VALIDATION COMPLETE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white flex items-center justify-center gap-2">
            Identities Unlocked
            <Sparkles className="w-6 h-6 text-electric-cyan animate-pulse" />
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Both sides verified technical depth without bias. The anonymous masks have dissolved; you are now free to build together!
          </p>
        </div>

        {/* Revealed Co-Founder Cards: Poster & Applicant */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Founder (Poster) */}
          <div className="p-5 rounded-2xl bg-surface-50/80 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-electric-cyan uppercase tracking-wider">
                Project Founder
              </span>
              <span className="text-xs font-mono text-gray-400">
                {audition.projectTitle.slice(0, 20)}...
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                  {posterIdentity.realName}
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </h4>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span>{posterIdentity.college} • {posterIdentity.yearOfStudy}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${posterIdentity.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{posterIdentity.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">LinkedIn:</span>
                  <a
                    href={posterIdentity.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-electric-cyan hover:underline flex items-center gap-1 truncate max-w-[170px]"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-gray-300">{posterIdentity.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Engineer (Applicant) */}
          <div className="p-5 rounded-2xl bg-surface-50/80 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-mono text-electric-violet uppercase tracking-wider">
                Verified Engineer
              </span>
              <span className="text-xs font-mono text-gray-400">
                Score: <span className="text-emerald-400 font-bold">{audition.score}/100</span>
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-1.5">
                  {applicantIdentity.realName}
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </h4>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                  <span>{applicantIdentity.college} • {applicantIdentity.yearOfStudy}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${applicantIdentity.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>{applicantIdentity.whatsapp}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">LinkedIn:</span>
                  <a
                    href={applicantIdentity.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-electric-cyan hover:underline flex items-center gap-1 truncate max-w-[170px]"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-gray-300">{applicantIdentity.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Generated Project Workspace Pod */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-surface-100 to-surface-50 border border-electric-cyan/20 space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-electric-cyan flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Auto-Provisioned Pod Workspace
            </span>
            <span className="text-[11px] font-mono text-emerald-400">Ready to Ship</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={githubOrgUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <Github className="w-5 h-5 text-white" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-electric-cyan">
                    GitHub Venture Repo
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono truncate max-w-[180px]">
                    {githubOrgUrl.replace("https://", "")}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </a>

            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#5865F2]">
                    Discord Private Pod
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono truncate max-w-[180px]">
                    Private sprint room
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400 font-mono">
            Enforced by Server Gatekeeper: Mutual Approval Recorded
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs hover:bg-cyan-300 transition-all shadow-glow-cyan"
          >
            Enter Project Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
