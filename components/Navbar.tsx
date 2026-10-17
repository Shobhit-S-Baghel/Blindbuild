"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Identicon } from "./Identicon";
import {
  ShieldAlert,
  Zap,
  PlusCircle,
  LayoutGrid,
  UserCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const {
    currentBuilder,
    demoMode,
    setDemoMode,
    setGuardrailDrawerOpen,
    addToast,
    refreshData,
  } = useApp();
  const [resetting, setResetting] = useState(false);

  const handleResetDB = async () => {
    if (!confirm("Reset database to initial pristine seed state?")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        addToast({
          title: "Database Reset",
          description: "Restored 8 anonymous builders and 5 venture projects.",
          type: "success",
        });
        await refreshData();
        window.location.reload();
      }
    } catch {
      // ignore
    } finally {
      setResetting(false);
    }
  };

  const navLinks = [
    { name: "Project Feed", href: "/projects", icon: LayoutGrid },
    { name: "Post an Idea", href: "/post-idea", icon: PlusCircle },
    { name: "My Dashboard", href: "/dashboard", icon: UserCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-electric-cyan to-electric-violet p-0.5 flex items-center justify-center shadow-glow-cyan/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#08090d] rounded-[7px] flex items-center justify-center">
                <span className="font-mono font-black text-xs text-electric-cyan">BB</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-base font-extrabold tracking-tight text-white group-hover:text-electric-cyan transition-colors">
                BLIND<span className="text-electric-cyan">BUILD</span>
              </span>
              <span className="text-[9px] font-mono text-gray-400 tracking-widest -mt-1 uppercase">
                Skill Over Status
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-surface-200 text-electric-cyan border border-electric-cyan/30 shadow-glow-cyan/30"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Demo Mode Toggle */}
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all border ${
              demoMode
                ? "bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-glow-emerald/30"
                : "bg-surface-100 border-white/10 text-gray-400 hover:text-gray-200"
            }`}
            title="Toggle presentation fast-forward timers and pre-fills"
          >
            <Zap className={`w-3.5 h-3.5 ${demoMode ? "text-amber-400 fill-amber-400" : ""}`} />
            <span className="hidden sm:inline">Demo Mode:</span>
            <span className="font-bold">{demoMode ? "ON" : "OFF"}</span>
          </button>

          {/* Autonomous Guardrail Log Drawer Trigger */}
          <button
            onClick={() => setGuardrailDrawerOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border border-white/10 bg-surface-50 text-gray-300 hover:text-electric-cyan hover:border-electric-cyan/40 transition-all"
            title="Open Autonomous AI Guardrail Activity Log"
          >
            <div className="relative">
              <ShieldAlert className="w-3.5 h-3.5 text-electric-cyan" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            </div>
            <span className="hidden md:inline">Guardrail Log</span>
          </button>

          {/* Reset DB Button */}
          <button
            onClick={handleResetDB}
            disabled={resetting}
            className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-white/5"
            title="Reset Database to Pristine Seed State"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
          </button>

          {/* Active Builder Profile Pill */}
          {currentBuilder ? (
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-surface-100/90 border border-white/10 hover:border-electric-cyan/40 transition-all group"
            >
              <Identicon seed={currentBuilder.stats.identiconSeed || currentBuilder.builderNumber} size={26} />
              <div className="flex flex-col text-left">
                <span className="font-mono text-xs font-semibold text-white group-hover:text-electric-cyan">
                  {currentBuilder.builderNumber}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 -mt-0.5">
                  Top {currentBuilder.stats.percentileRank}%
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-electric-cyan text-black hover:bg-cyan-300 transition-all shadow-glow-cyan"
            >
              Get Verified
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
