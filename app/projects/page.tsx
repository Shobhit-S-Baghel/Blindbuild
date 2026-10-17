"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { Identicon } from "@/components/Identicon";
import {
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function ProjectsFeedPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const skillFilters = ["ALL", "Rust", "Python", "FastAPI", "Next.js", "Go", "Docker", "WebRTC", "AI/ML"];

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const url = selectedSkill === "ALL" ? "/api/projects" : `/api/projects?skill=${encodeURIComponent(selectedSkill)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [selectedSkill]);

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.oneLinePitch.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>INCUBATOR VENTURE FEED</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Anonymous Technical Blueprints
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Founder identities concealed. Scoped by Gemini AI with live architecture diagrams and open roles.
          </p>
        </div>

        <Link
          href="/post-idea"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs hover:bg-cyan-300 transition-all shadow-glow-cyan shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Scope & Post Idea</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, architecture, or tech stack tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
            />
          </div>

          <span className="text-xs text-gray-400 font-mono hidden sm:inline">
            {filteredProjects.length} Active Ventures
          </span>
        </div>

        {/* Skill Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
          <span className="text-xs text-gray-400 font-mono mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter Skill:
          </span>
          {skillFilters.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedSkill === skill
                  ? "bg-electric-cyan text-black font-semibold shadow-glow-cyan"
                  : "bg-surface-100 text-gray-300 hover:text-white hover:bg-surface-200 border border-white/5"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-surface-50/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl glass-panel border border-white/10 space-y-3 font-mono text-xs text-gray-400">
          <div>No projects found matching the selected filter.</div>
          <button
            onClick={() => {
              setSelectedSkill("ALL");
              setSearchQuery("");
            }}
            className="text-electric-cyan underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-2xl glass-panel glass-card-hover border border-white/10 flex flex-col justify-between space-y-5"
            >
              {/* Header: Poster + Originality Score */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center space-x-3">
                    <Identicon seed={project.posterNumber} size={38} />
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <span>{project.posterNumber}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-[11px] font-mono text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Originality Index Chip */}
                  <div
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-surface-100 border border-white/10 text-xs font-mono"
                    title={`AI Originality Score: ${project.originality.score}/100`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
                    <span className="text-gray-400">AI Novelty:</span>
                    <span className="text-white font-bold">{project.originality.score}/100</span>
                  </div>
                </div>

                {/* Title & Pitch */}
                <Link href={`/projects/${project.id}`} className="group">
                  <h3 className="text-lg font-bold text-white group-hover:text-electric-cyan transition-colors mb-1.5 flex items-center gap-1.5">
                    {project.title}
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-electric-cyan" />
                  </h3>
                </Link>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {project.oneLinePitch}
                </p>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-200/90 text-electric-cyan border border-electric-cyan/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Open Roles Section */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>OPEN ROLES ({project.roles.length})</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    Est: {project.totalEstHours}h MVP
                  </span>
                </div>

                <div className="space-y-2">
                  {project.roles.map((role) => (
                    <div
                      key={role.id}
                      className="p-3 rounded-xl bg-surface-50/70 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold font-mono text-white flex items-center gap-2">
                          <span>{role.title}</span>
                          <span className="text-[10px] text-gray-400 font-sans">({role.estHours}h)</span>
                        </div>
                        <div className="text-[11px] text-gray-400 font-mono">
                          Req: <span className="text-gray-300">{role.minStats}</span>
                        </div>
                      </div>

                      <Link
                        href={`/audition/${project.id}?roleId=${role.id}`}
                        className="px-3 py-1.5 rounded-lg bg-electric-cyan/10 hover:bg-electric-cyan text-electric-cyan hover:text-black border border-electric-cyan/30 text-xs font-semibold font-mono transition-all text-center shrink-0"
                      >
                        Join Project →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 flex items-center justify-between text-xs font-mono text-gray-400">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-electric-cyan hover:underline flex items-center gap-1"
                >
                  <span>View Technical Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span>{project.roles.filter((r) => r.status === "OPEN").length} roles open</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
