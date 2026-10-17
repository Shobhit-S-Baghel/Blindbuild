"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ProjectRole } from "@/types";
import { MermaidViewer } from "@/components/MermaidViewer";
import {
  Sparkles,
  Send,
  RefreshCw,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Plus,
  Trash2,
  HelpCircle,
  Code2,
} from "lucide-react";

export default function PostIdeaPage() {
  const router = useRouter();
  const { currentBuilder, addToast, demoMode, setGuardrailDrawerOpen } = useApp();

  // Project Fields
  const [title, setTitle] = useState("");
  const [pitch, setPitch] = useState("");
  const [techStackInput, setTechStackInput] = useState("Next.js, FastAPI, PostgreSQL, Redis, Docker");
  const [totalEstHours, setTotalEstHours] = useState(36);
  const [diagramMermaid, setDiagramMermaid] = useState(
    `graph TD\n  Client[Next.js Client] --> Gateway[API Gateway]\n  Gateway --> Service[Core Service]\n  Service --> DB[(PostgreSQL)]\n  Service --> Cache[(Redis Cache)]`
  );

  // Roles with custom questions typed by user
  const [roles, setRoles] = useState<ProjectRole[]>([
    {
      id: "role-1",
      title: "Backend & Systems Lead",
      skills: ["FastAPI", "Python", "Redis", "PostgreSQL"],
      minStats: "Top 10% in Top Language or 400+ commits",
      estHours: 14,
      status: "OPEN",
      customQuestion: "How would you architect the database indexing and caching eviction strategy to keep p99 query latency under 20ms?",
    },
    {
      id: "role-2",
      title: "Frontend & Realtime UI Engineer",
      skills: ["Next.js", "TypeScript", "Tailwind CSS", "WebSockets"],
      minStats: "Top 12% Frontend or 1+ hackathon win",
      estHours: 12,
      status: "OPEN",
      customQuestion: "How would you implement zero-lag state synchronization and optimistic UI updates for concurrent campus users?",
    },
  ]);

  // AI helper states
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  const [suggestingRoleIdx, setSuggestingRoleIdx] = useState<number | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<Record<number, string>>({});
  const [publishing, setPublishing] = useState(false);

  // Demo prefill helper
  const handlePrefillSample = () => {
    setTitle("CampusMesh: P2P Offline Exam & Notes Sync");
    setPitch("Zero-internet local CRDT synchronizer over campus Wi-Fi & Bluetooth mesh for collaborative course builds.");
    setTechStackInput("Rust, WASM, WebRTC, IndexedDB, Next.js");
    setDiagramMermaid(
      `graph TD\n  PeerA[Peer Node A / Browser] <-->|WebRTC DataChannel| PeerB[Peer Node B / Browser]\n  PeerA --> CRDT[Delta CRDT Engine]\n  CRDT --> Storage[(IndexedDB Local Vault)]`
    );
    setRoles([
      {
        id: "role-1",
        title: "Rust / WASM CRDT Engine Lead",
        skills: ["Rust", "WASM", "Automerge", "CRDTs"],
        minStats: "Top 5% Rust or 500+ commits",
        estHours: 16,
        status: "OPEN",
        customQuestion: "How would you guarantee causal consistency and handle split-brain partitions when 20 peers edit the same markdown document simultaneously during a Wi-Fi dropout?",
      },
      {
        id: "role-2",
        title: "WebRTC Mesh Networking Specialist",
        skills: ["WebRTC", "SDP Handshake", "STUN/TURN", "TypeScript"],
        minStats: "Top 8% Systems / WebSockets",
        estHours: 14,
        status: "OPEN",
        customQuestion: "How would you design the WebRTC signaling handshake and ICE restart strategy when campus NATs block direct peer-to-peer UDP traffic?",
      },
    ]);
    addToast({
      title: "Sample Idea Loaded",
      description: "Loaded sample venture idea with custom audition questions.",
      type: "info",
    });
  };

  // 1-Click AI Suggest Architecture & Roles
  const handleAiSuggestBlueprint = async () => {
    if (!title.trim() && !pitch.trim()) {
      addToast({
        title: "Provide Title or Pitch First",
        description: "Enter your idea title or pitch so AI can suggest relevant architecture and roles.",
        type: "error",
      });
      return;
    }

    setIsGeneratingBlueprint(true);
    try {
      const splitTech = techStackInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/ai/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Campus Venture",
          pitch: pitch || title,
          techStack: splitTech,
        }),
      });

      const data = await res.json();
      if (data.blueprint) {
        if (!title) setTitle(data.blueprint.title);
        if (!pitch) setPitch(data.blueprint.oneLinePitch);
        if (data.blueprint.techStack?.length) {
          setTechStackInput(data.blueprint.techStack.join(", "));
        }
        if (data.blueprint.diagramMermaid) {
          setDiagramMermaid(data.blueprint.diagramMermaid);
        }
        if (data.blueprint.roles?.length) {
          setRoles(data.blueprint.roles);
        }
        if (data.blueprint.totalEstHours) {
          setTotalEstHours(data.blueprint.totalEstHours);
        }

        addToast({
          title: "AI Blueprint Suggested!",
          description: "Generated architecture diagram and suggested roles with audition questions.",
          type: "success",
        });
      }
    } catch {
      addToast({
        title: "Suggestion Failed",
        description: "Using standard fallback architecture templates.",
        type: "info",
      });
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  // AI Suggest Question for a specific role
  const handleAiSuggestQuestion = async (index: number) => {
    const targetRole = roles[index];
    if (!targetRole) return;

    setSuggestingRoleIdx(index);
    try {
      const splitTech = techStackInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/auditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUGGEST_QUESTION",
          roleTitle: targetRole.title,
          projectTitle: title || "Campus Venture",
          techStack: targetRole.skills.length > 0 ? targetRole.skills : splitTech,
        }),
      });

      const data = await res.json();
      if (data.question) {
        setSuggestedQuestions((prev) => ({
          ...prev,
          [index]: data.question,
        }));
        addToast({
          title: "AI Question Suggested",
          description: "Review the suggestion below. Click 'Add this question' to use it.",
          type: "info",
        });
      }
    } catch {
      // fallback
    } finally {
      setSuggestingRoleIdx(null);
    }
  };

  const applySuggestedQuestion = (index: number) => {
    const suggestion = suggestedQuestions[index];
    if (!suggestion) return;

    setRoles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        customQuestion: suggestion,
      };
      return updated;
    });

    // Clear suggestion banner after adding
    setSuggestedQuestions((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });

    addToast({
      title: "Audition Question Added",
      description: "Adopted AI suggested question into your role requirement.",
      type: "success",
    });
  };

  const addRole = () => {
    const newId = `role-${Date.now()}`;
    setRoles((prev) => [
      ...prev,
      {
        id: newId,
        title: "Fullstack / Cloud Engineer",
        skills: ["TypeScript", "Docker", "PostgreSQL"],
        minStats: "Top 15% in Top Language",
        estHours: 10,
        status: "OPEN",
        customQuestion: "What failure modes would you consider when deploying this service to campus edge nodes?",
      },
    ]);
  };

  const removeRole = (index: number) => {
    if (roles.length <= 1) {
      addToast({
        title: "At least one role required",
        description: "Your project needs at least one open role for applicants.",
        type: "error",
      });
      return;
    }
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRoleField = (index: number, field: keyof ProjectRole, value: unknown) => {
    setRoles((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !pitch.trim()) {
      addToast({
        title: "Title & Pitch Required",
        description: "Please provide a project title and one-line pitch.",
        type: "error",
      });
      return;
    }

    setPublishing(true);
    try {
      // 1. Guardrail moderation check on text content
      const modRes = await fetch("/api/guardrails/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${title} ${pitch} ${roles.map((r) => r.customQuestion).join(" ")}`,
          builderNumber: currentBuilder?.builderNumber || "Builder #409",
        }),
      });
      const modData = await modRes.json();
      if (!modData.allowed) {
        addToast({
          title: "Blocked by Guardrail",
          description: modData.reason,
          type: "guardrail",
          detectedPatterns: modData.detectedPatterns,
        });
        setGuardrailDrawerOpen(true);
        setPublishing(false);
        return;
      }

      // 2. Publish Project
      const splitTech = techStackInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posterId: currentBuilder?.id || "b-409",
          posterNumber: currentBuilder?.builderNumber || "Builder #409",
          title,
          oneLinePitch: pitch,
          techStack: splitTech,
          diagramMermaid,
          roles,
          totalEstHours,
          risks: [
            "Cold-start latency during peak registration surges",
            "State synchronization across multi-tenant sessions",
          ],
          stressTestSummary: "Pragmatic MVP architecture partitioned into modular services with automated caching.",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.blocked) {
          addToast({
            title: "Originality Guardrail Block",
            description: data.reason,
            type: "guardrail",
          });
          setGuardrailDrawerOpen(true);
        } else {
          throw new Error(data.error || "Failed to publish");
        }
        return;
      }

      addToast({
        title: "Venture Published!",
        description: `Your idea is live on the feed under ${currentBuilder?.builderNumber || "Builder #409"}.`,
        type: "success",
      });

      router.push(`/projects/${data.project.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error publishing";
      addToast({
        title: "Publication Error",
        description: message,
        type: "error",
      });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>DIRECT VENTURE BUILDER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Post Your Venture Idea
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Describe your idea, set custom audition questions for applicants, and publish anonymously under{" "}
            <span className="text-electric-cyan font-mono">{currentBuilder?.builderNumber || "Builder #409"}</span>.
          </p>
        </div>

        {demoMode && (
          <button
            type="button"
            onClick={handlePrefillSample}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-glow-emerald/30 shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400" />
            <span>Prefill Sample Idea</span>
          </button>
        )}
      </div>

      <form onSubmit={handlePublish} className="space-y-8">
        {/* STEP 1: IDEA BASICS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-electric-cyan/20 text-electric-cyan flex items-center justify-center text-xs">
                1
              </span>
              Project Overview
            </h2>

            {/* AI Suggest Architecture & Roles button */}
            <button
              type="button"
              onClick={handleAiSuggestBlueprint}
              disabled={isGeneratingBlueprint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-electric-violet/10 text-electric-violet border border-electric-violet/30 hover:bg-electric-violet/20 transition-all shadow-glow-violet/30"
              title="Click to automatically suggest architecture and open roles based on your idea"
            >
              {isGeneratingBlueprint ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Suggest Architecture & Roles</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">
                Project Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CampusMesh: P2P Offline Exam & Notes Sync"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-electric-cyan transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1.5">
                One-Line Pitch / Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Explain what it does, why it matters, and the core problem it solves on campus..."
                className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. Next.js, FastAPI, Redis, PostgreSQL, Docker"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5">
                  Est. Sprint Hours
                </label>
                <input
                  type="number"
                  value={totalEstHours}
                  onChange={(e) => setTotalEstHours(Number(e.target.value) || 36)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: ARCHITECTURE DIAGRAM (MERMAID) */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-electric-cyan/20 text-electric-cyan flex items-center justify-center text-xs">
                2
              </span>
              System Architecture Diagram (Mermaid)
            </h2>
            <span className="text-xs font-mono text-electric-cyan">Live Rendered</span>
          </div>

          <div className="space-y-3">
            <textarea
              rows={4}
              value={diagramMermaid}
              onChange={(e) => setDiagramMermaid(e.target.value)}
              placeholder="graph TD\n  Client --> Gateway..."
              className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
            />
            <MermaidViewer chart={diagramMermaid} />
          </div>
        </div>

        {/* STEP 3: OPEN ROLES WITH USER-DEFINED AUDITION QUESTIONS */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-electric-cyan/20 text-electric-cyan flex items-center justify-center text-xs">
                  3
                </span>
                Open Roles & Your Audition Questions
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Type the exact technical question candidates must answer. Click &apos;AI Suggest Question&apos; for inspiration.
              </p>
            </div>

            <button
              type="button"
              onClick={addRole}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-surface-200 text-white hover:bg-surface-300 border border-white/10 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-6">
            {roles.map((role, idx) => (
              <div
                key={role.id || idx}
                className="p-5 rounded-2xl bg-surface-50/80 border border-white/10 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-electric-cyan uppercase">
                    Role #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeRole(idx)}
                    className="text-gray-400 hover:text-rose-400 transition-colors p-1"
                    title="Remove this role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={role.title}
                      onChange={(e) => updateRoleField(idx, "title", e.target.value)}
                      placeholder="e.g. Backend & Systems Lead"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Skills (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={role.skills.join(", ")}
                      onChange={(e) =>
                        updateRoleField(
                          idx,
                          "skills",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="e.g. Rust, WASM, Distributed Systems"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Minimum Verified Bar
                    </label>
                    <input
                      type="text"
                      value={role.minStats}
                      onChange={(e) => updateRoleField(idx, "minStats", e.target.value)}
                      placeholder="e.g. Top 8% in Top Language or 400+ commits"
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-gray-300 mb-1">
                      Estimated Build Hours
                    </label>
                    <input
                      type="number"
                      value={role.estHours}
                      onChange={(e) => updateRoleField(idx, "estHours", Number(e.target.value) || 12)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                    />
                  </div>
                </div>

                {/* USER-DEFINED AUDITION QUESTION */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-electric-cyan font-semibold flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Your Audition Question for Candidates:
                    </label>

                    {/* AI Suggest Question Button */}
                    <button
                      type="button"
                      onClick={() => handleAiSuggestQuestion(idx)}
                      disabled={suggestingRoleIdx === idx}
                      className="text-xs font-mono text-electric-violet hover:underline flex items-center gap-1"
                    >
                      {suggestingRoleIdx === idx ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>AI Suggest Question</span>
                        </>
                      )}
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={role.customQuestion || ""}
                    onChange={(e) => updateRoleField(idx, "customQuestion", e.target.value)}
                    placeholder="Type the exact question the applicant must answer during their 3-minute audition..."
                    className="w-full p-3 rounded-xl bg-black/70 border border-electric-cyan/20 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                  />

                  {/* AI SUGGESTION BANNER IF GENERATED */}
                  {suggestedQuestions[idx] && (
                    <div className="p-3 rounded-xl bg-electric-violet/10 border border-electric-violet/30 text-xs font-mono space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between text-electric-violet font-semibold">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          AI Question Suggestion:
                        </span>
                        <button
                          type="button"
                          onClick={() => applySuggestedQuestion(idx)}
                          className="px-2.5 py-1 rounded bg-electric-violet text-white text-[11px] font-bold hover:bg-violet-400 transition-colors"
                        >
                          Add this question
                        </button>
                      </div>
                      <p className="text-gray-200 text-[11px] font-sans leading-relaxed">
                        &quot;{suggestedQuestions[idx]}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PUBLISH BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-white/10">
          <div className="text-xs font-mono text-gray-400">
            Publishing as: <span className="text-electric-cyan font-bold">{currentBuilder?.builderNumber || "Builder #409"}</span>
          </div>

          <button
            type="submit"
            disabled={publishing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center space-x-2"
          >
            {publishing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Guardrails & Publishing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Publish Project to Feed →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
