"use client";

import React, { useState } from "react";
import { VerifiedStats } from "@/types";
import { ShieldCheck, CheckCircle2, XCircle, RefreshCw, KeyRound, Copy, Check } from "lucide-react";

interface SignatureVerifyModalProps {
  stats: VerifiedStats;
  isOpen: boolean;
  onClose: () => void;
}

export function SignatureVerifyModal({ stats, isOpen, onClose }: SignatureVerifyModalProps) {
  const [testingTamper, setTestingTamper] = useState(false);
  const [tamperedPercentile, setTamperedPercentile] = useState(stats.percentileRank);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<{
    isValid: boolean;
    computedSignature: string;
    canonicalString: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (tamper: boolean = false) => {
    setVerifying(true);
    try {
      const payload = {
        builderNumber: stats.builderNumber,
        topLanguage: stats.topLanguage,
        percentileRank: tamper ? 1 : stats.percentileRank,
        contributionsCount: stats.contributionsCount,
        hackathonWinsCount: stats.hackathonWins.count,
        hasVerifiedMLRepo: stats.hasVerifiedMLRepo,
      };

      const res = await fetch("/api/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload,
          signature: stats.cryptographicSignature,
        }),
      });

      const data = await res.json();
      setResult({
        isValid: data.isValid,
        computedSignature: data.computedSignature,
        canonicalString: data.canonicalString,
      });
    } catch {
      // error
    } finally {
      setVerifying(false);
    }
  };

  const copySignature = () => {
    navigator.clipboard.writeText(stats.cryptographicSignature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden border rounded-2xl glass-panel border-electric-cyan/30 shadow-glow-cyan">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-electric-cyan/10 text-electric-cyan">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Cryptographic Verification Engine</h3>
              <p className="text-xs text-gray-400 font-mono">HMAC-SHA256 Canonical State Proof</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-300">
            BlindBuild issues a cryptographic signature over each builder’s verified GitHub, LeetCode, and contest achievements. Any client or venture fund can recompute the hash to guarantee metrics have not been forged or inflated.
          </p>

          {/* Canonical Payload Inspection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>CANONICAL PAYLOAD ATTRIBUTES</span>
              <span className="text-electric-cyan">{stats.builderNumber}</span>
            </div>
            <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-gray-300 space-y-1">
              <div><span className="text-gray-500">builder:</span> {stats.builderNumber}</div>
              <div><span className="text-gray-500">topLanguage:</span> {stats.topLanguage}</div>
              <div><span className="text-gray-500">percentileRank:</span> Top {testingTamper ? tamperedPercentile : stats.percentileRank}% {testingTamper && <span className="text-rose-400 font-bold">(TAMPERED)</span>}</div>
              <div><span className="text-gray-500">contributionsCount:</span> {stats.contributionsCount} commits</div>
              <div><span className="text-gray-500">hackathonWins:</span> {stats.hackathonWins.count} verified</div>
              <div><span className="text-gray-500">verifiedMLRepo:</span> {stats.hasVerifiedMLRepo ? "TRUE" : "FALSE"}</div>
            </div>
          </div>

          {/* Cryptographic Signature Hex */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span>STORED HMAC-SHA256 SIGNATURE</span>
              <button
                onClick={copySignature}
                className="flex items-center space-x-1 text-electric-cyan hover:underline"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="p-3 font-mono text-xs break-all rounded-lg bg-black/80 border border-electric-cyan/20 text-electric-cyan">
              {stats.cryptographicSignature}
            </div>
          </div>

          {/* Interactive Recomputation Test */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setTestingTamper(false);
                  handleVerify(false);
                }}
                disabled={verifying}
                className="px-4 py-2 text-xs font-medium text-black transition-all rounded-lg bg-electric-cyan hover:bg-cyan-300 shadow-glow-cyan flex items-center space-x-2"
              >
                {verifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                <span>Recompute & Verify Signature</span>
              </button>

              <button
                onClick={() => {
                  setTestingTamper(true);
                  setTamperedPercentile(1);
                  handleVerify(true);
                }}
                className="px-3 py-2 text-xs font-medium text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Simulate someone changing their rank from 4% to 1%"
              >
                Simulate Tamper
              </button>
            </div>

            <div className="text-xs text-gray-400 font-mono">
              Status: <span className="text-emerald-400">Live Server Recompute</span>
            </div>
          </div>

          {/* Result Alert */}
          {result && (
            <div
              className={`p-4 rounded-xl border flex items-start space-x-3 transition-all ${
                result.isValid
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/40 border-rose-500/40 text-rose-200"
              }`}
            >
              {result.isValid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <div className="font-semibold text-sm">
                  {result.isValid ? "Cryptographic Signature Matches Bit-for-Bit" : "Signature Verification Failed: Tamper Detected!"}
                </div>
                <div>
                  {result.isValid
                    ? "The computed HMAC-SHA256 digest strictly matches the issued signature. All verified GitHub, LeetCode, and hackathon data are genuine."
                    : "The hash does not match because the payload was modified. BlindBuild successfully prevented unauthorized credential tampering."}
                </div>
                <div className="font-mono text-[11px] text-gray-400 pt-1">
                  Computed: {result.computedSignature.slice(0, 36)}...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-surface-50/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
