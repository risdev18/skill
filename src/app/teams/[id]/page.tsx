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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Teams</span>
        </Link>

        {/* Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wider mb-2">
                Team Skill Gap Diagnostic
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {team.projectTitle}
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Category: {team.category} • Team Roster: {team.members.length} / {project.maxTeamSize} Members
              </p>
            </div>

            <Link
              href={`/matching?project=${project.id}`}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all"
            >
              <Cpu className="w-4 h-4" />
              <span>Find Candidates for Missing Skills</span>
            </Link>
          </div>

          {/* Honest Coverage Estimate Banner */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-900">Honest Capability Methodology:</strong> The team&apos;s effective proficiency for each required skill is determined by the highest declared proficiency among current members (e.g., Python: Member A = Intermediate, Member B = Advanced → Team Effective = Advanced). Multiple entry-level members are never falsely assumed to equal an expert.
            </div>
          </div>
        </div>

        {/* Coverage Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500">Total Required Skills</span>
            <div className="text-2xl font-bold text-slate-900 mt-1">{gapReport.totalRequiredSkills}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Fully Covered
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{gapReport.coveredCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Partially Covered
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1">{gapReport.partiallyCoveredCount}</div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-rose-700 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              Completely Missing
            </span>
            <div className="text-2xl font-bold text-rose-700 mt-1">{gapReport.missingCount}</div>
          </div>
        </div>

        {/* Dynamic Recruitment Recommendations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Synthesized Recruitment Recommendations
          </h3>

          <div className="space-y-3">
            {gapReport.recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-700 leading-relaxed"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Competency Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="pb-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Skill-by-Skill Capability Matrix
            </h3>
            <span className="text-xs text-slate-500">
              Evaluated against project requirements
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px]">
                  <th className="pb-3 font-semibold">Required Skill</th>
                  <th className="pb-3 font-semibold">Project Weight</th>
                  <th className="pb-3 font-semibold">Target Proficiency</th>
                  <th className="pb-3 font-semibold">Team Effective Level</th>
                  <th className="pb-3 font-semibold">Coverage Status</th>
                  <th className="pb-3 font-semibold">Members With Skill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {gapReport.skillsAnalysis.map((skill) => (
                  <tr key={skill.skillName} className="hover:bg-slate-50">
                    <td className="py-3 font-bold text-slate-900">{skill.skillName}</td>
                    <td className="py-3 font-mono text-slate-600">{skill.weight}%</td>
                    <td className="py-3 text-slate-600">
                      {PROFICIENCY_LABELS[skill.requiredProficiency]}
                    </td>
                    <td className="py-3 font-semibold">
                      {skill.teamEffectiveProficiency > 0 ? (
                        <span className="text-indigo-700">
                          {PROFICIENCY_LABELS[skill.teamEffectiveProficiency as SkillProficiency]}
                        </span>
                      ) : (
                        <span className="text-rose-600 italic">None (0)</span>
                      )}
                    </td>
                    <td className="py-3">
                      {skill.status === "covered" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Adequate
                        </span>
                      )}
                      {skill.status === "partially_covered" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Partial Gap
                        </span>
                      )}
                      {skill.status === "missing" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          Missing
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      {skill.membersWithSkill.length === 0 ? (
                        <span className="text-slate-400 text-[11px] italic">0 members</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {skill.membersWithSkill.map((m) => (
                            <span
                              key={m.studentId}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700"
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
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            Current Team Roster ({team.members.length} / {project.maxTeamSize})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {team.members.map((member) => (
              <div
                key={member.studentId}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    {member.student.avatarUrl ? (
                      <Image
                        src={member.student.avatarUrl}
                        alt={member.student.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-xs">
                        {member.student.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {member.student.fullName}
                    </h4>
                    <p className="text-[10px] text-indigo-600 font-medium truncate mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {member.student.department} • {member.student.academicYear}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex justify-end">
                  <Link
                    href={`/students/${member.student.id}`}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
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
