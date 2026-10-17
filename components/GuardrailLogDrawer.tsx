"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { GuardrailLogEntry } from "@/types";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X,
  FileCode,
  Lock,
  Search,
} from "lucide-react";

export function GuardrailLogDrawer() {
  const { guardrailDrawerOpen, setGuardrailDrawerOpen } = useApp();
  const [logs, setLogs] = useState<GuardrailLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "BLOCKED" | "PASS">("ALL");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/guardrails/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (guardrailDrawerOpen) {
      fetchLogs();
    }
  }, [guardrailDrawerOpen]);

  if (!guardrailDrawerOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    return log.verdict === filter;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-xl h-full bg-[#0a0d17] border-l border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-surface-50/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                Autonomous AI Guardrail
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Dual-pass inspection (Regex + Gemini LLM) enforcing anonymity & originality
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLogs}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setGuardrailDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-3 border-b border-white/5 bg-surface-100/40 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-mono">Filter:</span>
            {(["ALL", "BLOCKED", "PASS"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`px-2.5 py-1 rounded-md font-mono text-xs transition-all ${
                  filter === opt
                    ? "bg-electric-cyan text-black font-semibold shadow-glow-cyan"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <span className="text-gray-400 font-mono text-[11px]">
            {filteredLogs.length} events logged
          </span>
        </div>

        {/* Log Entries List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-mono text-xs border border-dashed border-white/10 rounded-xl">
              No guardrail events matching filter. Try posting an idea or testing contact leak moderation!
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isBlocked = log.verdict === "BLOCKED";
              const isPass = log.verdict === "PASS";

              return (
                <div
                  key={log.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isBlocked
                      ? "bg-rose-950/20 border-rose-500/30"
                      : isPass
                      ? "bg-surface-50/50 border-white/5"
                      : "bg-amber-950/20 border-amber-500/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {isBlocked ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                          BLOCKED
                        </span>
                      ) : isPass ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          WARNING
                        </span>
                      )}

                      <span className="text-xs font-mono font-semibold text-gray-300">
                        {log.actionType}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-gray-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Builder & Input */}
                  <div className="mt-2.5 space-y-1.5 font-mono text-xs">
                    <div className="text-gray-400">
                      Entity: <span className="text-electric-cyan">{log.builderNumber}</span>
                    </div>
                    <div className="p-2 rounded bg-black/60 border border-white/5 text-gray-300 text-[11px] truncate">
                      &quot;{log.inputSnippet}&quot;
                    </div>
                  </div>

                  {/* Reason & Details */}
                  <div className="mt-2.5 text-xs text-gray-300">
                    <p className="text-gray-400 text-[11px] font-sans">{log.reason}</p>
                    {log.blockedDetails && log.blockedDetails.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {log.blockedDetails.map((item, i) => (
                          <span
                            key={i}
                            className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          >
                            ⚠️ {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-surface-50/50 flex items-center justify-between text-xs text-gray-400">
          <span className="font-mono text-[11px]">Enforcement: Dual-Tier (Regex + Gemini)</span>
          <button
            onClick={() => setGuardrailDrawerOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-surface-200 text-white hover:bg-surface-300 transition-colors font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
