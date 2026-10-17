"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SEED_BUILDERS } from "@/lib/seedData";
import { Zap, ShieldAlert, CopyCheck, UserCheck, ChevronUp, ChevronDown } from "lucide-react";

export function DemoModeBanner() {
  const { demoMode, currentBuilder, setCurrentBuilder, addToast, setGuardrailDrawerOpen } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  if (!demoMode) return null;

  const handleTestContactLeak = async () => {
    const leakMessage = "Hey bro, text me on WhatsApp at +91 9871234567 or email me at rahul.sharma@gmail.com";
    try {
      const res = await fetch("/api/guardrails/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: leakMessage,
          builderNumber: currentBuilder?.builderNumber || "Builder #409",
        }),
      });
      const data = await res.json();
      if (!data.allowed) {
        addToast({
          title: "Blocked by Guardrail",
          description: data.reason,
          type: "guardrail",
          detectedPatterns: data.detectedPatterns,
        });
      }
    } catch {
      // ignore
    }
  };

  const handleTestDuplicateProject = async () => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posterId: currentBuilder?.id || "b-409",
          posterNumber: currentBuilder?.builderNumber || "Builder #409",
          title: "CampusMesh Offline Notes Sync", // Exact concept of proj-101
          oneLinePitch: "P2P offline exam and notes sync over WebRTC mesh and CRDTs for campus.",
          techStack: ["Rust", "WebRTC", "Next.js"],
        }),
      });

      const data = await res.json();
      if (data.blocked) {
        addToast({
          title: "Originality Guardrail Triggered",
          description: data.reason,
          type: "guardrail",
        });
        setGuardrailDrawerOpen(true);
      }
    } catch {
      // ignore
    }
  };

  const switchBuilder = (builderId: string) => {
    const target = SEED_BUILDERS.find((b) => b.id === builderId);
    if (target) {
      setCurrentBuilder(target);
      addToast({
        title: "Switched Active Persona",
        description: `Now acting as ${target.builderNumber} (${target.stats.topLanguage})`,
        type: "info",
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm rounded-xl border border-amber-500/40 bg-[#0c0f18]/95 backdrop-blur-md shadow-2xl p-3 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2 text-amber-300 font-mono font-bold">
          <Zap className="w-4 h-4 fill-amber-400" />
          <span>Demo Controller</span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {!collapsed && (
        <div className="pt-2 space-y-2">
          <div className="text-[11px] text-gray-400">
            Speed-up timers are enabled. Test guardrails or switch builder perspectives for the live mutual reveal:
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={handleTestContactLeak}
              className="p-1.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-left transition-colors flex items-center space-x-1"
              title="Send a sample contact leak (+91 9871234567)"
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Test Contact Leak</span>
            </button>

            <button
              onClick={handleTestDuplicateProject}
              className="p-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-left transition-colors flex items-center space-x-1"
              title="Try publishing duplicate CampusMesh idea"
            >
              <CopyCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Test Duplicate Copy</span>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] font-mono border-t border-white/5">
            <span className="text-gray-400">Switch Persona:</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => switchBuilder("b-409")}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  currentBuilder?.id === "b-409"
                    ? "bg-electric-cyan text-black font-bold"
                    : "bg-surface-200 text-gray-300 hover:text-white"
                }`}
              >
                #409 (Founder)
              </button>
              <button
                onClick={() => switchBuilder("b-219")}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  currentBuilder?.id === "b-219"
                    ? "bg-electric-violet text-white font-bold"
                    : "bg-surface-200 text-gray-300 hover:text-white"
                }`}
              >
                #219 (Applicant)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
