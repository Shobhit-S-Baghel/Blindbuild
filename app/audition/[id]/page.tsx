"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Project, ProjectRole, Audition } from "@/types";
import { VerifiedStatsCard } from "@/components/VerifiedStatsCard";
import {
  Clock,
  ShieldCheck,
  Sparkles,
  Send,
  Github,
  Code2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";

export default function MicroAuditionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentBuilder, addToast, demoMode, setGuardrailDrawerOpen } = useApp();

  const projectId = params?.id as string;
  const roleId = searchParams.get("roleId") || "";

  const [project, setProject] = useState<Project | null>(null);
  const [role, setRole] = useState<ProjectRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Audition Choice
  const [auditionType, setAuditionType] = useState<"QUESTION" | "PR_LINK">("QUESTION");
  const [generatedQuestion, setGeneratedQuestion] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);

  // Timer states (3 minutes = 180 seconds, or 30s in demo mode)
  const initialTime = demoMode ? 30 : 180;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timerActive, setTimerActive] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);

  // Answer input
  const [applicantAnswer, setApplicantAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [auditionResult, setAuditionResult] = useState<Audition | null>(null);

  // Load project & role
  useEffect(() => {
    async function init() {
      if (!projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project);

          const r = data.project.roles.find((item: ProjectRole) => item.id === roleId) || data.project.roles[0];
          setRole(r);

          // Prioritize founder's custom question
          if (r) {
            if (r.customQuestion && r.customQuestion.trim()) {
              setGeneratedQuestion(r.customQuestion);
              setTimerActive(true);
            } else {
              fetchQuestion(r, data.project);
            }
          }
        }
      } catch {
        // error
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [projectId, roleId]);

  const fetchQuestion = async (selectedRole: ProjectRole, currentProject: Project) => {
    setQuestionLoading(true);
    try {
      const res = await fetch("/api/auditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUGGEST_QUESTION",
          roleTitle: selectedRole.title,
          projectTitle: currentProject.title,
          techStack: selectedRole.skills.length > 0 ? selectedRole.skills : currentProject.techStack,
        }),
      });
      const data = await res.json();
      setGeneratedQuestion(data.question);
      setTimerActive(true);
    } catch {
      setGeneratedQuestion("Explain your strategy for scaling the backend pipeline under 10k concurrent campus requests.");
      setTimerActive(true);
    } finally {
      setQuestionLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!timerActive || auditionResult) return;

    if (timeLeft <= 0) {
      setTimeExpired(true);
      setTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, timerActive, auditionResult]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Demo prefill answers
  const handlePrefillAnswer = (type: "QUESTION" | "PR_LINK") => {
    if (type === "QUESTION") {
      setAuditionType("QUESTION");
      setApplicantAnswer(
        "I would architect this using state-based Delta-CRDTs with Lamport logical timestamps. Each peer mutation updates local IndexedDB atomically with a monotonic sequence number. During synchronization, peers exchange compact vector clocks over WebRTC DataChannels so only missing deltas are transferred, ensuring sub-50ms reconciliation with zero central server overhead."
      );
    } else {
      setAuditionType("PR_LINK");
      setApplicantAnswer("https://github.com/priya-distributed/crdt-mesh-core/pull/14");
    }
    addToast({
      title: "Audition Response Pre-Filled",
      description: "High-signal engineering response ready for Gemini Bar Raiser evaluation.",
      type: "info",
    });
  };

  const handleSubmitAudition = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!applicantAnswer.trim()) {
      addToast({
        title: "Answer Required",
        description: "Please provide an architectural explanation or GitHub commit link.",
        type: "error",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/auditions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SUBMIT_AUDITION",
          projectId,
          roleId: role?.id || "role-1",
          roleTitle: role?.title || "Engineer",
          applicantId: currentBuilder?.id || "b-219",
          applicantNumber: currentBuilder?.builderNumber || "Builder #219",
          auditionType,
          questionText: generatedQuestion,
          applicantAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.blocked) {
          addToast({
            title: "Contact Info Blocked",
            description: data.reason,
            type: "guardrail",
            detectedPatterns: data.details,
          });
          setGuardrailDrawerOpen(true);
        } else {
          throw new Error(data.error || "Submission failed");
        }
        return;
      }

      setAuditionResult(data.audition);
      setTimerActive(false);

      addToast({
        title: data.audition.passed ? "Audition Passed!" : "Audition Completed",
        description: `Gemini Bar Raiser scored your audition ${data.audition.score}/100.`,
        type: data.audition.passed ? "success" : "info",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Submission error";
      addToast({
        title: "Submission Error",
        description: message,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center font-mono text-xs text-gray-400">
        Loading Micro-Audition Handshake...
      </div>
    );
  }

  if (!project || !role) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Project or Role Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 text-electric-cyan text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3-MINUTE TECHNICAL HANDSHAKE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Micro-Audition: {role.title}
          </h1>
          <p className="text-xs font-mono text-gray-400 mt-0.5">
            Target Project: <span className="text-white">{project.title}</span> • Min Bar:{" "}
            <span className="text-amber-300">{role.minStats}</span>
          </p>
        </div>

        {/* Live Countdown Timer */}
        <div
          className={`flex items-center space-x-3 px-5 py-3 rounded-2xl border backdrop-blur-xl ${
            timeLeft < 30
              ? "bg-rose-950/40 border-rose-500/50 text-rose-300 animate-pulse shadow-glow-violet/30"
              : "bg-surface-100/90 border-white/10 text-white"
          }`}
        >
          <Clock className={`w-5 h-5 ${timeLeft < 30 ? "text-rose-400" : "text-electric-cyan"}`} />
          <div className="text-right font-mono">
            <div className="text-[10px] text-gray-400 uppercase tracking-widest">
              {timeExpired ? "TIME EXPIRED" : "TIME REMAINING"}
            </div>
            <div className="text-xl font-black">{formatTimer(timeLeft)}</div>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: AUDITION PROMPT & INTERACTIVE WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          {/* Audition Mode Tabs */}
          <div className="p-1.5 rounded-xl bg-surface-100/90 border border-white/10 flex items-center space-x-2">
            <button
              onClick={() => setAuditionType("QUESTION")}
              disabled={!!auditionResult}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                auditionType === "QUESTION"
                  ? "bg-electric-cyan text-black font-bold shadow-glow-cyan"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>(A) Role Architecture Challenge</span>
            </button>

            <button
              onClick={() => setAuditionType("PR_LINK")}
              disabled={!!auditionResult}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-medium transition-all flex items-center justify-center space-x-1.5 ${
                auditionType === "PR_LINK"
                  ? "bg-electric-cyan text-black font-bold shadow-glow-cyan"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Github className="w-3.5 h-3.5" />
              <span>(B) Relevant GitHub Commit / PR</span>
            </button>
          </div>

          {/* QUESTION PROMPT CARD */}
          <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-electric-cyan uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Founder&apos;s Audition Question
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => role && project && fetchQuestion(role, project)}
                  disabled={questionLoading}
                  className="text-xs font-mono text-electric-violet hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{questionLoading ? "Suggesting..." : "AI Suggest Question"}</span>
                </button>
                <span className="text-[11px] font-mono text-gray-400">Pass: 70/100</span>
              </div>
            </div>

            {questionLoading ? (
              <div className="p-4 text-xs font-mono text-gray-400 animate-pulse">
                Fetching question suggestion...
              </div>
            ) : (
              <p className="text-sm font-mono text-gray-100 leading-relaxed bg-black/50 p-4 rounded-xl border border-white/5">
                {auditionType === "QUESTION"
                  ? generatedQuestion
                  : `Paste a public GitHub commit or Pull Request link demonstrating your mastery of ${role.skills.join(", ")}.`}
              </p>
            )}
          </div>

          {/* RESPONSE WORKSPACE OR RESULT */}
          {!auditionResult ? (
            <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-gray-300">
                  {auditionType === "QUESTION" ? "Your Technical Architecture Answer" : "GitHub Commit / PR Link"}
                </label>
                {demoMode && (
                  <button
                    type="button"
                    onClick={() => handlePrefillAnswer(auditionType)}
                    className="text-xs font-mono text-amber-300 hover:underline flex items-center gap-1"
                  >
                    <Zap className="w-3 h-3" />
                    <span>Prefill High-Signal Answer</span>
                  </button>
                )}
              </div>

              {auditionType === "QUESTION" ? (
                <textarea
                  rows={6}
                  value={applicantAnswer}
                  onChange={(e) => setApplicantAnswer(e.target.value)}
                  placeholder="Explain trade-offs, concurrency models, data structures, and edge-case mitigations..."
                  className="w-full p-4 rounded-xl bg-black/70 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan leading-relaxed transition-colors"
                />
              ) : (
                <input
                  type="url"
                  value={applicantAnswer}
                  onChange={(e) => setApplicantAnswer(e.target.value)}
                  placeholder="https://github.com/username/repo/commit/..."
                  className="w-full px-4 py-3 rounded-xl bg-black/70 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-electric-cyan transition-colors"
                />
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-gray-400">
                  Submitting anonymously as:{" "}
                  <span className="text-electric-cyan">{currentBuilder?.builderNumber || "Builder #219"}</span>
                </span>

                <button
                  onClick={handleSubmitAudition}
                  disabled={submitting || !applicantAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-electric-cyan text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-glow-cyan flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Grading via Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Audition</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* AUDITION RESULT CARD */
            <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 bg-[#091518] shadow-glow-cyan/20 space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  {auditionResult.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400" />
                  )}
                  <div>
                    <h3 className="font-mono text-sm font-bold text-white">
                      Audition Evaluation Complete
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">
                      Status: {auditionResult.passed ? "PASSED (Threshold Met)" : "BELOW THRESHOLD"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-gray-400">SCORE</div>
                  <div className="text-2xl font-bold font-mono text-electric-cyan">
                    {auditionResult.score}/100
                  </div>
                </div>
              </div>

              {/* Systems Critique */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-1.5 font-mono text-xs">
                <span className="text-electric-cyan font-bold">Technical Systems Critique:</span>
                <p className="text-gray-300 font-sans leading-relaxed">{auditionResult.feedback}</p>
              </div>

              {/* Next Step: Mutual Approval Status */}
              <div className="p-4 rounded-xl bg-surface-50 border border-white/5 space-y-2 text-xs">
                <div className="font-mono font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Awaiting Founder Approval
                </div>
                <p className="text-gray-400 leading-relaxed font-sans">
                  The founder ({project.posterNumber}) has received your technical transcript and verified Stats Card. As soon as both sides approve, your identities and auto-provisioned workspace will be revealed!
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full py-3 rounded-xl bg-electric-cyan text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-cyan-300 transition-all shadow-glow-cyan text-center"
                >
                  View in My Dashboard →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: APPLICANT STATS CARD PREVIEW */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Your Transmitted Stats Card
            </span>
            <span className="text-[11px] font-mono text-emerald-400">ENCRYPTED TRANSMISSION</span>
          </div>

          {currentBuilder ? (
            <VerifiedStatsCard stats={currentBuilder.stats} />
          ) : (
            <div className="p-6 rounded-2xl glass-panel border border-white/10 text-center font-mono text-xs text-gray-400">
              No stats card linked. Onboard first!
            </div>
          )}

          <div className="p-4 rounded-xl bg-surface-50/50 border border-white/5 text-xs text-gray-400 space-y-1">
            <div className="font-mono text-white text-[11px] font-semibold">
              Double-Blind Handshake Protocol:
            </div>
            <p className="leading-relaxed">
              The founder sees only your verified percentile rank, contribution graph, and audition answer. No contact leaks or real names are accessible until mutual double-opt-in approval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
