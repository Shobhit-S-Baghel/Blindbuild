"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { ShieldAlert, CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast, setGuardrailDrawerOpen } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-md w-full pointer-events-none p-4">
      {toasts.map((toast) => {
        const isGuardrail = toast.type === "guardrail";
        const isError = toast.type === "error";
        const isSuccess = toast.type === "success";

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5 duration-200 ${
              isGuardrail
                ? "bg-rose-950/90 border-rose-500/50 text-white shadow-glow-violet/30"
                : isError
                ? "bg-rose-950/80 border-rose-500/30 text-white"
                : isSuccess
                ? "bg-[#0b1c14]/90 border-emerald-500/40 text-emerald-100"
                : "bg-surface-100/90 border-white/10 text-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start space-x-3">
                <div className="shrink-0 mt-0.5">
                  {isGuardrail ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                  ) : isError ? (
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Info className="w-5 h-5 text-electric-cyan" />
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-mono tracking-tight text-white flex items-center gap-2">
                    {toast.title}
                  </h4>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed">
                    {toast.description}
                  </p>

                  {toast.detectedPatterns && toast.detectedPatterns.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {toast.detectedPatterns.map((pat, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        >
                          Blocked: {pat}
                        </span>
                      ))}
                    </div>
                  )}

                  {isGuardrail && (
                    <button
                      onClick={() => setGuardrailDrawerOpen(true)}
                      className="text-[11px] font-mono text-rose-300 underline hover:text-white pt-1 block"
                    >
                      View in Guardrail Log →
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
