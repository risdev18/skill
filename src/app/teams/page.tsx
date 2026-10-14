"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
} from "lucide-react";
import { analyzeTeamSkillGaps } from "@/lib/gap-analyzer";

export default function TeamsPage() {
  const { teams, projects } = useApp();

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Team Capability Diagnostics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Teams & Skill Gap Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Inspect current project rosters, evaluate effective team proficiency, and discover critical competencies missing from your team.
            </p>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const project = projects.find((p) => p.id === team.projectId);
            if (!project) return null;

            const gapReport = analyzeTeamSkillGaps(
              project.id,
              project.title,
              project.requiredSkills,
              team.members
            );

            return (
              <div
                key={team.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                      {team.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {team.members.length} / {project.maxTeamSize} Members
                    </span>
                  </div>

                  <Link href={`/teams/${team.id}`}>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors mt-2">
                      {team.projectTitle}
                    </h3>
                  </Link>

                  {/* Coverage Gauge */}
                  <div className="mt-4 p-3.5 bg-black/40 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Skill Coverage:</span>
                      <span
                        className={`font-bold ${
                          gapReport.coveragePercentage >= 80
                            ? "text-emerald-400"
                            : gapReport.coveragePercentage >= 50
                            ? "text-amber-400"
                            : "text-rose-400"
                        }`}
                      >
                        {gapReport.coveragePercentage}% Adequately Covered
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{
                          width: `${(gapReport.coveredCount / gapReport.totalRequiredSkills) * 100}%`,
                        }}
                        title={`Covered: ${gapReport.coveredCount}`}
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{
                          width: `${(gapReport.partiallyCoveredCount / gapReport.totalRequiredSkills) * 100}%`,
                        }}
                        title={`Partially: ${gapReport.partiallyCoveredCount}`}
                      />
                      <div
                        className="bg-rose-500 h-full"
                        style={{
                          width: `${(gapReport.missingCount / gapReport.totalRequiredSkills) * 100}%`,
                        }}
                        title={`Missing: ${gapReport.missingCount}`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        {gapReport.coveredCount} Covered
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <AlertTriangle className="w-3 h-3" />
                        {gapReport.partiallyCoveredCount} Partial
                      </span>
                      <span className="flex items-center gap-1 text-rose-400">
                        <XCircle className="w-3 h-3" />
                        {gapReport.missingCount} Missing
                      </span>
                    </div>
                  </div>

                  {/* Member Avatars */}
                  <div className="mt-4">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Roster Members
                    </div>
                    <div className="flex items-center gap-2">
                      {team.members.map((m) => (
                        <div
                          key={m.studentId}
                          className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-white/10"
                          title={`${m.student.fullName} (${m.role})`}
                        >
                          {m.student.avatarUrl ? (
                            <Image
                              src={m.student.avatarUrl}
                              alt={m.student.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-white text-[10px]">
                              {m.student.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={`/matching?project=${project.id}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Match Candidates</span>
                  </Link>

                  <Link
                    href={`/teams/${team.id}`}
                    className="px-3.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-xl text-xs font-semibold border border-amber-500/30 transition-colors flex items-center gap-1"
                  >
                    <span>Inspect Gaps</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
