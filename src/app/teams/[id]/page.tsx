"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Cpu,
  Info,
  Sparkles,
  ExternalLink,
  Plus,
} from "lucide-react";
import { analyzeTeamSkillGaps } from "@/lib/gap-analyzer";
import { PROFICIENCY_LABELS, SkillProficiency } from "@/types";

export default function TeamSkillGapDetailPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params?.id as string;

  const { teams, projects, students } = useApp();

  const team = teams.find((t) => t.id === teamId) || teams[0];
  const project = projects.find((p) => p.id === team?.projectId);

  if (!team || !project) {
    return (
      <AppShell>
        <div className="p-12 text-center">
          <h2 className="text-lg font-bold text-white">Team Not Found</h2>
          <Link
            href="/teams"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Teams</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  // Run the Team Skill Gap Analyzer
  const gapReport = analyzeTeamSkillGaps(
    project.id,
    project.title,
    project.requiredSkills,
    team.members
  );

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Back link */}
        <Link
          href="/teams"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teams</span>
        </Link>

        {/* Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                Team Skill Gap Diagnostic
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {team.projectTitle}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Category: {team.category} • Team Roster: {team.members.length} / {project.maxTeamSize} Members
              </p>
            </div>

            <Link
              href={`/matching?project=${project.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Find Candidates for Missing Skills</span>
            </Link>
          </div>

          {/* Honest Coverage Estimate Banner */}
          <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs text-slate-300">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white">Honest Capability Methodology:</strong> The team&apos;s effective proficiency for each required skill is determined by the highest declared proficiency among current members (e.g., Python: Member A = Intermediate, Member B = Advanced → Team Effective = Advanced). Multiple entry-level members are never falsely assumed to equal an expert.
            </div>
          </div>
        </div>

        {/* Coverage Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0F1626] border border-white/10">
            <span className="text-[11px] font-medium text-slate-400">Total Required Skills</span>
            <div className="text-2xl font-bold text-white mt-1">{gapReport.totalRequiredSkills}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1626] border border-white/10">
            <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fully Covered
            </span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{gapReport.coveredCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1626] border border-white/10">
            <span className="text-[11px] font-medium text-amber-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              Partially Covered
            </span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{gapReport.partiallyCoveredCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1626] border border-white/10">
            <span className="text-[11px] font-medium text-rose-400 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              Completely Missing
            </span>
            <div className="text-2xl font-bold text-rose-400 mt-1">{gapReport.missingCount}</div>
          </div>
        </div>

        {/* Dynamic Recruitment Recommendations */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Synthesized Recruitment Recommendations
          </h3>

          <div className="space-y-3">
            {gapReport.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3 text-xs text-slate-200 leading-relaxed"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Competency Table */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
          <div className="pb-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Skill-by-Skill Capability Matrix
            </h3>
            <span className="text-xs text-slate-400">
              Evaluated against project requirements
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 text-[11px]">
                  <th className="pb-3 font-medium">Required Skill</th>
                  <th className="pb-3 font-medium">Project Weight</th>
                  <th className="pb-3 font-medium">Target Proficiency</th>
                  <th className="pb-3 font-medium">Team Effective Level</th>
                  <th className="pb-3 font-medium">Coverage Status</th>
                  <th className="pb-3 font-medium">Members With Skill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {gapReport.skillsAnalysis.map((skill) => (
                  <tr key={skill.skillName} className="hover:bg-white/5">
                    <td className="py-3 font-bold text-white">{skill.skillName}</td>
                    <td className="py-3 font-mono text-slate-400">{skill.weight}%</td>
                    <td className="py-3 text-slate-300">
                      {PROFICIENCY_LABELS[skill.requiredProficiency]}
                    </td>
                    <td className="py-3 font-semibold">
                      {skill.teamEffectiveProficiency > 0 ? (
                        <span className="text-indigo-300">
                          {PROFICIENCY_LABELS[skill.teamEffectiveProficiency as SkillProficiency]}
                        </span>
                      ) : (
                        <span className="text-rose-400 italic">None (0)</span>
                      )}
                    </td>
                    <td className="py-3">
                      {skill.status === "covered" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Adequate
                        </span>
                      )}
                      {skill.status === "partially_covered" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          Partial Gap
                        </span>
                      )}
                      {skill.status === "missing" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                          <XCircle className="w-3 h-3" />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {skill.membersWithSkill.length === 0 ? (
                        <span className="text-slate-500 text-[11px] italic">0 members</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {skill.membersWithSkill.map((m) => (
                            <span
                              key={m.studentId}
                              className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300"
                            >
                              {m.studentName} ({PROFICIENCY_LABELS[m.proficiency]})
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Current Team Roster Cards */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Current Team Roster ({team.members.length} / {project.maxTeamSize})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team.members.map((member) => (
              <div
                key={member.studentId}
                className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    {member.student.avatarUrl ? (
                      <Image
                        src={member.student.avatarUrl}
                        alt={member.student.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                        {member.student.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {member.student.fullName}
                    </h4>
                    <p className="text-[10px] text-indigo-400 font-medium truncate mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {member.student.department} • {member.student.academicYear}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex justify-end">
                  <Link
                    href={`/students/${member.student.id}`}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View Student Profile →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
