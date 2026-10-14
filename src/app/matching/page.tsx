"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Cpu,
  Sparkles,
  HelpCircle,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  BookmarkCheck,
  Bookmark,
  Sliders,
  Scale,
  Plus,
  Trash2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Award,
  Users,
} from "lucide-react";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { ExplainabilityModal } from "@/components/ExplainabilityModal";
import {
  calculateMatchScore,
  rankStudentsForProject,
  validateAndNormalizeWeights,
} from "@/lib/matching";
import { Project, RequiredSkill, SkillProficiency, PROFICIENCY_LABELS } from "@/types";

export default function MatchingEnginePage() {
  const searchParams = useSearchParams();
  const initialProjectId = searchParams.get("project");

  const { projects, students, toggleShortlist, currentStudent } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId && projects.some((p) => p.id === initialProjectId)
      ? initialProjectId
      : projects[0]?.id || ""
  );

  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  // Custom sandbox mode toggle
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [customSkills, setCustomSkills] = useState<RequiredSkill[]>([
    { id: "c-1", skillName: "Python", weight: 35, minimumProficiency: 3 },
    { id: "c-2", skillName: "Machine Learning", weight: 35, minimumProficiency: 2 },
    { id: "c-3", skillName: "React", weight: 30, minimumProficiency: 2 },
  ]);

  const [sandboxSkillName, setSandboxSkillName] = useState("");
  const [sandboxWeight, setSandboxWeight] = useState(30);
  const [sandboxProf, setSandboxProf] = useState<SkillProficiency>(2);

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const activeRequiredSkills = useMemo(() => {
    return isSandboxMode ? customSkills : activeProject?.requiredSkills || [];
  }, [isSandboxMode, customSkills, activeProject]);

  const weightValidation = useMemo(() => {
    return validateAndNormalizeWeights(activeRequiredSkills);
  }, [activeRequiredSkills]);

  // Execute the deterministic matching engine across student candidates (excluding faculty/recruiters)
  const candidatePool = useMemo(() => {
    return students.filter(
      (s) => s.userRole !== "recruiter" && s.userRole !== "project_owner"
    );
  }, [students]);

  const rankedResults = useMemo(() => {
    if (!weightValidation.isValid) return [];
    try {
      return rankStudentsForProject(activeRequiredSkills, candidatePool, {
        projectCategory: isSandboxMode ? undefined : activeProject?.category,
        experiencePreference: isSandboxMode ? undefined : activeProject?.experiencePreference,
      });
    } catch (e) {
      console.error("Matching error:", e);
      return [];
    }
  }, [activeRequiredSkills, candidatePool, isSandboxMode, activeProject, weightValidation]);

  const handleAddSandboxSkill = () => {
    if (!sandboxSkillName.trim()) return;
    setCustomSkills((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        skillName: sandboxSkillName.trim(),
        weight: Number(sandboxWeight) || 20,
        minimumProficiency: sandboxProf,
      },
    ]);
    setSandboxSkillName("");
  };

  const handleRemoveSandboxSkill = (id: string) => {
    setCustomSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header with Title and How it Works CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Deterministic Algorithm • Pure TypeScript</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Skill Matching Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Calculates transparent compatibility scores, highlights skill gaps, and synthesizes explainable candidate justifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExplainModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>How is this score calculated?</span>
            </button>
          </div>
        </div>

        {/* Project Target & Sandbox Selector */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0F1626] border border-white/10 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Target Requirements Source
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSandboxMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !isSandboxMode
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Preloaded Project ({projects.length} Available)
              </button>
              <button
                onClick={() => setIsSandboxMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSandboxMode
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                Custom Skill Sandbox
              </button>
            </div>
          </div>

          {!isSandboxMode ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Select Project Opportunity:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} — {proj.category} (Owner: {proj.ownerName})
                    </option>
                  ))}
                </select>
              </div>

              {activeProject && (
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-xs text-slate-300 sm:w-1/2">
                  <div className="font-semibold text-white truncate">{activeProject.title}</div>
                  <div className="text-[11px] text-indigo-400 mt-0.5">
                    Category: {activeProject.category} • Target: {activeProject.experiencePreference} • Open Positions: {activeProject.openPositions || (activeProject.maxTeamSize - activeProject.currentTeamSize)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 space-y-3">
              <p className="text-xs text-slate-400">
                Define custom skills and weights to test how the matching engine evaluates the student roster on arbitrary requirements.
              </p>

              {/* Sandbox Skills List */}
              <div className="flex flex-wrap gap-2">
                {customSkills.map((sk) => (
                  <span
                    key={sk.id}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-black/50 border border-white/10 rounded-lg text-xs text-slate-200"
                  >
                    <span className="font-semibold text-white">{sk.skillName}</span>
                    <span className="text-indigo-400 font-mono">
                      ({sk.weight}%, Min: {PROFICIENCY_LABELS[sk.minimumProficiency]})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSandboxSkill(sk.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Custom Skill */}
              <div className="flex flex-wrap gap-2 pt-2">
                <input
                  type="text"
                  value={sandboxSkillName}
                  onChange={(e) => setSandboxSkillName(e.target.value)}
                  placeholder="Skill name (e.g. C, Python, Java, SQL, React)"
                  className="flex-1 min-w-[160px] px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={sandboxWeight}
                  onChange={(e) => setSandboxWeight(Number(e.target.value))}
                  placeholder="Weight"
                  className="w-20 px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <select
                  value={sandboxProf}
                  onChange={(e) => setSandboxProf(Number(e.target.value) as SkillProficiency)}
                  className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Min: Beginner</option>
                  <option value={2}>Min: Intermediate</option>
                  <option value={3}>Min: Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSandboxSkill}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {/* Active Requirements Badges */}
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">Active Criteria:</span>
            {activeRequiredSkills.map((req, i) => {
              const normWeight = weightValidation.normalizedWeights?.[i];
              return (
                <span
                  key={req.id}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 border border-white/5 flex items-center gap-1.5"
                >
                  <strong>{req.skillName}</strong>
                  <span className="text-indigo-400 font-mono">
                    {normWeight !== undefined ? `${Math.round(normWeight)}%` : `${req.weight}%`}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    (Min: {PROFICIENCY_LABELS[req.minimumProficiency]})
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Validation Errors if any */}
        {!weightValidation.isValid && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{weightValidation.error}</span>
          </div>
        )}

        {/* Top Recommended Students for Open Positions */}
        {rankedResults.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">
                  Recommended Students for Open Positions ({activeProject?.openPositions || 2} Open Spots)
                </span>
                <span className="text-[11px] text-slate-400">
                  Top matches: <strong className="text-indigo-300">{rankedResults[0]?.studentName} ({rankedResults[0]?.overallScore}%)</strong>, <strong className="text-indigo-300">{rankedResults[1]?.studentName} ({rankedResults[1]?.overallScore}%)</strong>
                </span>
              </div>
            </div>

            <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 w-fit">
              Deterministic Roster Ranking
            </span>
          </div>
        )}

        {/* Candidate Ranking List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Ranked <strong className="text-white">{rankedResults.length}</strong> qualified student candidates
            </span>
            <span className="text-slate-500">Sorted strictly by descending match percentage</span>
          </div>

          {rankedResults.map((result, index) => {
            const student = students.find((s) => s.id === result.studentId);
            if (!student) return null;

            const isExpanded = expandedCandidateId === result.studentId;

            return (
              <div
                key={result.studentId}
                className="rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all p-5 sm:p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Student Identity & Rank */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-indigo-400 shrink-0">
                      #{index + 1}
                    </div>

                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                      {student.avatarUrl ? (
                        <Image
                          src={student.avatarUrl}
                          alt={student.fullName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm">
                          {student.fullName.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/students/${student.id}`}
                          className="text-base font-bold text-white hover:text-indigo-400 transition-colors truncate"
                        >
                          {student.fullName}
                        </Link>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
                          {student.academicYear}
                        </span>
                      </div>

                      <p className="text-xs text-indigo-400 font-medium truncate mt-0.5">
                        {student.department}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1 truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {student.college}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {student.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score & Dynamic Summary */}
                  <div className="flex items-center gap-4 shrink-0">
                    <MatchScoreBadge
                      score={result.overallScore}
                      baseScore={result.baseSkillScore}
                      bonusScore={result.bonusScore}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleShortlist(student.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          student.shortlisted
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10"
                        }`}
                        title={student.shortlisted ? "Shortlisted" : "Add to shortlist"}
                      >
                        {student.shortlisted ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() =>
                          setExpandedCandidateId(isExpanded ? null : result.studentId)
                        }
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                      >
                        <span>{isExpanded ? "Hide Details" : "Inspect Math"}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Generated Dynamic Explanation Banner */}
                <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 italic flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>&quot;{result.explanation}&quot;</span>
                </div>

                {/* Expanded Mathematical & Gap Breakdown */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-white/10 space-y-4 animate-in fade-in duration-200">
                    {/* Math Contribution Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span>Skill Contribution Formula Breakdown</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          (weight × min(candidateProf / requiredProf, 1))
                        </span>
                      </h4>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                              <th className="pb-2 font-medium">Skill</th>
                              <th className="pb-2 font-medium">Req. Level</th>
                              <th className="pb-2 font-medium">Candidate Level</th>
                              <th className="pb-2 font-medium">Proficiency Ratio</th>
                              <th className="pb-2 font-medium">Weight</th>
                              <th className="pb-2 font-medium text-right">Contribution</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-slate-300">
                            {result.matchedSkills.map((m) => {
                              const ratio = Math.min(m.studentProficiency / m.requiredProficiency, 1);
                              return (
                                <tr key={m.skillName} className="hover:bg-white/5">
                                  <td className="py-2 font-semibold text-white">{m.skillName}</td>
                                  <td className="py-2 text-slate-400">{PROFICIENCY_LABELS[m.requiredProficiency]}</td>
                                  <td className="py-2 text-indigo-300 font-semibold">{PROFICIENCY_LABELS[m.studentProficiency]}</td>
                                  <td className="py-2 font-mono text-slate-400">{(ratio * 100).toFixed(0)}%</td>
                                  <td className="py-2 font-mono text-slate-400">{m.weight}%</td>
                                  <td className="py-2 font-mono font-bold text-emerald-400 text-right">+{m.contribution}%</td>
                                </tr>
                              );
                            })}
                            {result.missingSkills.map((ms) => (
                              <tr key={ms.skillName} className="hover:bg-white/5">
                                <td className="py-2 font-semibold text-slate-400">{ms.skillName}</td>
                                <td className="py-2 text-slate-400">{PROFICIENCY_LABELS[ms.requiredProficiency]}</td>
                                <td className="py-2 text-rose-400 italic">Missing (0)</td>
                                <td className="py-2 font-mono text-slate-500">0%</td>
                                <td className="py-2 font-mono text-slate-400">{ms.weight}%</td>
                                <td className="py-2 font-mono text-slate-500 text-right">+0.0%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Reasons & Suggestions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-3.5 rounded-xl bg-[#090D16] border border-emerald-500/20 text-xs">
                        <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Key Alignment Factors
                        </div>
                        <ul className="space-y-1.5 text-slate-300 text-[11px]">
                          {result.reasons.length > 0 ? (
                            result.reasons.map((r, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-400">•</span>
                                <span>{r}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-slate-500">No special bonus adjustments applied.</li>
                          )}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#090D16] border border-amber-500/20 text-xs">
                        <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Identified Gaps & Suggestions
                        </div>
                        <ul className="space-y-1.5 text-slate-300 text-[11px]">
                          {result.suggestions.length > 0 ? (
                            result.suggestions.map((s, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <span className="text-amber-400">•</span>
                                <span>{s}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-emerald-400">Candidate satisfies all project proficiency expectations!</li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Link
                        href={`/students/${student.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
                      >
                        <span>View Full Candidate Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ExplainabilityModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </AppShell>
  );
}
