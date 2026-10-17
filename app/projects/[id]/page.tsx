"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Project } from "@/types";
import { Identicon } from "@/components/Identicon";
import { MermaidViewer } from "@/components/MermaidViewer";
import {
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Code2,
  CheckCircle2,
  Layers,
  Zap,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      if (!id) return;
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center font-mono text-xs text-gray-400">
        Loading Technical Blueprint...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project Blueprint Not Found</h2>
        <Link href="/projects" className="text-electric-cyan underline font-mono text-xs">
          ← Back to Venture Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Back Navigation */}
      <Link
        href="/projects"
        className="inline-flex items-center space-x-1.5 text-xs font-mono text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Project Feed</span>
      </Link>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <Identicon seed={project.posterNumber} size={48} />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white">
                  {project.posterNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30">
                  Founder
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Scoped via Gemini Venture Scoper • Published {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-surface-100 border border-white/10 text-right">
              <div className="text-[10px] font-mono text-gray-400">TOTAL SPRINT</div>
              <div className="text-sm font-bold font-mono text-white flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-electric-cyan" />
                <span>{project.totalEstHours} Hours</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-surface-100 border border-white/10 text-right">
              <div className="text-[10px] font-mono text-gray-400">AI NOVELTY</div>
              <div className="text-sm font-bold font-mono text-emerald-400">
                {project.originality.score}/100
              </div>
            </div>
          </div>
        </div>

        {/* Title and Pitch */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>
          <p className="text-base text-gray-300 leading-relaxed max-w-3xl">
            {project.oneLinePitch}
          </p>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {project.techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-surface-200 text-electric-cyan border border-electric-cyan/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* MERMAID ARCHITECTURE DIAGRAM SECTION */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-electric-cyan" />
              MVP System Architecture
            </h2>
            <p className="text-xs text-gray-400">
              Live AST-rendered Mermaid flowchart generated during AI stress-test interview
            </p>
          </div>
          <span className="text-[11px] font-mono text-electric-cyan bg-electric-cyan/10 px-2.5 py-1 rounded-md border border-electric-cyan/20">
            Mermaid.js Live
          </span>
        </div>

        {/* Live Mermaid Renderer */}
        <MermaidViewer chart={project.diagramMermaid} />
      </div>

      {/* TWO-COLUMN: OPEN ROLES & ORIGINALITY/RISK BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* OPEN ROLES COLUMN */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-electric-cyan" />
              Open Engineering Roles ({project.roles.length})
            </h2>
            <span className="text-xs font-mono text-gray-400">3-min timed audition</span>
          </div>

          <div className="space-y-3">
            {project.roles.map((role) => (
              <div
                key={role.id}
                className="p-5 rounded-2xl glass-panel border border-white/10 space-y-3 hover:border-electric-cyan/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-white">
                      {role.title}
                    </h3>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      Estimated Build: <span className="text-gray-200">{role.estHours} Hours</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      role.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-surface-200 text-gray-400"
                    }`}
                  >
                    {role.status}
                  </span>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Min Verified Stats */}
                <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 text-xs font-mono text-gray-300 flex items-center justify-between">
                  <span>Minimum Bar:</span>
                  <span className="text-amber-300 font-semibold">{role.minStats}</span>
                </div>

                {/* Founder's Audition Question Preview */}
                {role.customQuestion && (
                  <div className="p-2.5 rounded-lg bg-electric-cyan/5 border border-electric-cyan/20 text-[11px] font-mono text-gray-300 space-y-1">
                    <span className="text-electric-cyan font-bold block">Founder&apos;s Audition Question:</span>
                    <p className="text-gray-400 font-sans italic">&quot;{role.customQuestion}&quot;</p>
                  </div>
                )}

                {/* Audition Button */}
                <Link
                  href={`/audition/${project.id}?roleId=${role.id}`}
                  className="w-full py-2.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs font-mono hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center justify-center space-x-1.5"
                >
                  <span>Start 3-Minute Micro-Audition →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* GUARDRAIL ORIGINALITY & STRESS TEST RISKS COLUMN */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Originality Breakdown Card */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-electric-cyan" />
                Originality & Feasibility Index
              </h3>
              <span className="text-xs font-mono font-bold text-electric-cyan">
                {project.originality.score}/100
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Concept Originality</span>
                  <span className="text-white">{project.originality.originality}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className="h-full bg-electric-cyan rounded-full"
                    style={{ width: `${project.originality.originality}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>Technical Feasibility</span>
                  <span className="text-white">{project.originality.technicalFeasibility}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className="h-full bg-electric-violet rounded-full"
                    style={{ width: `${project.originality.technicalFeasibility}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-400 mb-1">
                  <span>48h Scope Realism</span>
                  <span className="text-white">{project.originality.scopeRealism}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${project.originality.scopeRealism}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans pt-2 border-t border-white/5 leading-relaxed">
              {project.originality.summary}
            </p>
          </div>

          {/* Stress-Test Summary & Risks */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Stress-Test Technical Risks
            </h3>

            <div className="space-y-2">
              {project.risks.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-surface-50/70 border border-white/5 text-xs text-gray-300 flex items-start space-x-2"
                >
                  <span className="text-amber-400 font-mono">0{idx + 1}.</span>
                  <span>{risk}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-xs text-gray-300 space-y-1">
              <div className="font-semibold text-white font-mono text-[11px] text-electric-cyan">
                Architectural Mitigation:
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                {project.stressTestSummary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
