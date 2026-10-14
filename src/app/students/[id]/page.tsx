"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Building2,
  Calendar,
  Clock,
  Github,
  Linkedin,
  Globe,
  Bookmark,
  BookmarkCheck,
  Cpu,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { PROFICIENCY_LABELS } from "@/types";
import { calculateMatchScore } from "@/lib/matching";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const { students, projects, toggleShortlist, currentStudent } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <AppShell>
        <div className="p-12 text-center">
          <h2 className="text-lg font-bold text-white">Student not found</h2>
          <p className="text-xs text-slate-400 mt-1">The requested profile could not be located in the directory.</p>
          <Link
            href="/discover"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Discovery</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isMentor = student.userRole === "recruiter" || student.userRole === "project_owner";
  const supervisedProjects = projects.filter((p) => p.ownerId === student.id);

  // Calculate live match against selected project for students
  const targetProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  const matchResult = targetProject && !isMentor
    ? calculateMatchScore(targetProject.requiredSkills, student, {
        projectCategory: targetProject.category,
        experiencePreference: targetProject.experiencePreference,
      })
    : null;

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-800 shrink-0 border-2 border-white/10 shadow-xl">
                {student.avatarUrl ? (
                  <Image
                    src={student.avatarUrl}
                    alt={student.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold text-white text-2xl">
                    {student.fullName.charAt(0)}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-2xl font-black text-white tracking-tight">
                    {student.fullName}
                  </h1>
                  {isMentor ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{student.userRole === "recruiter" ? "Campus Club Recruiter" : "Project Creator & Mentor"}</span>
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                      {student.academicYear}
                    </span>
                  )}
                </div>

                {student.organization && (
                  <p className="text-xs font-bold text-amber-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{student.organization}</span>
                    {student.roleTitle && <span className="text-slate-400 font-normal">• {student.roleTitle}</span>}
                  </p>
                )}

                <p className="text-sm text-indigo-400 font-semibold mt-1">
                  {student.department}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {student.college}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {student.availability}
                  </span>
                </div>

                {/* External Links */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                  {student.portfolioUrl && (
                    <a
                      href={student.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                      title="Portfolio"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {student.githubUrl && (
                    <a
                      href={student.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {student.linkedinUrl && (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => toggleShortlist(student.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                student.shortlisted
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20"
                  : "bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10"
              }`}
            >
              {student.shortlisted ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Shortlisted</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Add to Shortlist</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Engineering Biography
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {student.bio}
            </p>
          </div>
        </div>

        {/* Profile Middle Section: Mentor Projects OR Student Compatibility Evaluator */}
        {isMentor ? (
          <div className="p-6 rounded-2xl bg-[#0F1626] border border-amber-500/20">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Capstone Projects Supervised & Mentored ({supervisedProjects.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Active capstone projects created and guided by this mentor for student teams
                </p>
              </div>
            </div>

            {supervisedProjects.length === 0 ? (
              <p className="text-xs text-slate-400 mt-4 italic">No active projects currently listed under this mentor.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                {supervisedProjects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="p-4 rounded-xl bg-black/40 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                          {p.openPositions !== undefined ? `${p.openPositions} Open Positions` : `${p.currentTeamSize}/${p.maxTeamSize} Members`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-indigo-400 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                      <span>Inspect Project & Applications</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Compatibility Against Projects
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Select a project opportunity to calculate how well {student.fullName} satisfies its skill requirements
                </p>
              </div>

              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="px-3.5 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {matchResult && (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-400">Deterministic Match Score:</span>
                      <MatchScoreBadge
                        score={matchResult.overallScore}
                        baseScore={matchResult.baseSkillScore}
                        bonusScore={matchResult.bonusScore}
                      />
                    </div>
                    <p className="text-xs text-slate-300 mt-2 italic leading-relaxed">
                      &quot;{matchResult.explanation}&quot;
                    </p>
                  </div>

                  <Link
                    href={`/matching?project=${selectedProjectId}`}
                    className="px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-xl text-xs font-semibold border border-indigo-500/30 whitespace-nowrap text-center transition-colors"
                  >
                    Inspect in Matching Engine
                  </Link>
                </div>

                {/* Matched & Missing Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#090D16] border border-white/5">
                    <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Covered Skills ({matchResult.matchedSkills.length})
                    </div>
                    <div className="space-y-1.5">
                      {matchResult.matchedSkills.map((m) => (
                        <div key={m.skillName} className="flex justify-between text-slate-300 text-[11px]">
                          <span>{m.skillName} (Lvl {m.studentProficiency}/{m.requiredProficiency})</span>
                          <span className="text-emerald-400 font-mono">+{m.contribution}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#090D16] border border-white/5">
                    <div className="font-semibold text-amber-400 flex items-center gap-1.5 mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Gaps / Missing ({matchResult.missingSkills.length})
                    </div>
                    <div className="space-y-1.5">
                      {matchResult.missingSkills.length === 0 ? (
                        <span className="text-slate-500 text-[11px]">No skill gaps detected!</span>
                      ) : (
                        matchResult.missingSkills.map((ms) => (
                          <div key={ms.skillName} className="flex justify-between text-slate-400 text-[11px]">
                            <span>{ms.skillName}</span>
                            <span className="text-rose-400 font-mono">{ms.weight}% weight</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Skills Showcase */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Declared Skills & Proficiencies
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {student.skills.map((s) => (
              <div
                key={s.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{s.skillName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.category || "General"}</div>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                    s.proficiency === 3
                      ? "bg-indigo-500/20 text-indigo-300"
                      : s.proficiency === 2
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {PROFICIENCY_LABELS[s.proficiency]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
