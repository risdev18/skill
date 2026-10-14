"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Users,
  Briefcase,
  Cpu,
  CheckSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Layers,
  PieChart as PieIcon,
  Award,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { calculateMatchScore } from "@/lib/matching";
import { PROFICIENCY_LABELS } from "@/types";

export default function DashboardPage() {
  const { currentStudent, students, projects, teams, tasks, applications } = useApp();

  // Find projects owned by current user
  const myProjects = projects.filter((p) => p.ownerId === currentStudent.id);
  // Find applications submitted by current user
  const myApplications = applications.filter((a) => a.studentId === currentStudent.id);
  // Find pending applications for projects owned by current user
  const incomingApplications = applications.filter(
    (a) => myProjects.some((p) => p.id === a.projectId) && a.status === "Pending"
  );
  // Tasks assigned to current user
  const myTasks = tasks.filter((t) => t.assigneeId === currentStudent.id);

  // Platform Metrics
  const totalOpenPositions = useMemo(() => {
    return projects.reduce((acc, p) => acc + Math.max(0, p.maxTeamSize - p.currentTeamSize), 0);
  }, [projects]);

  const totalPendingApps = useMemo(() => {
    return applications.filter((a) => a.status === "Pending").length;
  }, [applications]);

  const taskStats = useMemo(() => {
    const done = tasks.filter((t) => t.status === "done").length;
    const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
    return { done, total: tasks.length, rate };
  }, [tasks]);

  // Most common technical skills across platform
  const topPlatformSkills = useMemo(() => {
    const skillFreq: Record<string, number> = {};
    students.forEach((s) => {
      s.skills.forEach((sk) => {
        skillFreq[sk.skillName] = (skillFreq[sk.skillName] || 0) + 1;
      });
    });
    return Object.entries(skillFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [students]);

  // Find candidate matches for user's primary project (or first project)
  const referenceProject = myProjects[0] || projects[0];
  const candidates = useMemo(() => {
    if (!referenceProject) return [];
    return students
      .filter((s) => s.id !== currentStudent.id && s.userRole !== "recruiter")
      .map((s) => ({
        student: s,
        match: calculateMatchScore(referenceProject.requiredSkills, s, {
          projectCategory: referenceProject.category,
          experiencePreference: referenceProject.experiencePreference,
        }),
      }))
      .sort((a, b) => b.match.overallScore - a.match.overallScore)
      .slice(0, 3);
  }, [referenceProject, students, currentStudent.id]);

  return (
    <AppShell>
      <div className="space-y-8 animate-in fade-in duration-300">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-indigo-950/60 via-[#0F1626] to-[#0F1626] border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Capstone Engineering Workspace • Ready for Faculty Demonstration</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {currentStudent.fullName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                {currentStudent.organization ? (
                  <span className="text-amber-400 font-semibold">{currentStudent.organization} ({currentStudent.roleTitle})</span>
                ) : (
                  <span>{currentStudent.department} • {currentStudent.college} ({currentStudent.academicYear})</span>
                )}
                {" — "}Availability: <span className="text-indigo-300 font-medium">{currentStudent.availability}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/matching"
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Cpu className="w-4 h-4" />
                <span>Run Match Engine</span>
              </Link>
              <Link
                href="/projects/new"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Executive Stats Grid (Real Demo Records) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Students</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-3">{students.length}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-indigo-400 font-semibold">{students.filter(s => s.userRole !== 'recruiter').length}</span> student builders cataloged
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Projects</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-3">{projects.length}</div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">{totalOpenPositions}</span> open team positions
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Pending Applications</span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white mt-3">{totalPendingApps}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across {applications.length} total applicant reviews
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Task Completion Rate</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 mt-3">{taskStats.rate}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {taskStats.done} of {taskStats.total} sprint milestones completed
            </div>
          </div>
        </div>

        {/* Most Common Skills in Platform */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0F1626] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider shrink-0">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>High-Demand Skills in Roster:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            {topPlatformSkills.map(([skillName, count]) => (
              <span
                key={skillName}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-300 flex items-center gap-1.5 font-medium"
              >
                <span>{skillName}</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1 rounded">
                  {count}
                </span>
              </span>
            ))}
          </div>

          <Link
            href="/analytics"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 shrink-0"
          >
            <span>View Full Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Highlight Section: Top Candidate Recommendations */}
        <div className="rounded-2xl bg-[#0F1626] border border-white/10 p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  Intelligent Candidate Matching
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Top complementary talent calculated for <strong className="text-slate-200">&quot;{referenceProject?.title}&quot;</strong>
              </p>
            </div>
            <Link
              href={`/matching?project=${referenceProject?.id}`}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              <span>Open Skill Matching Engine</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {candidates.map(({ student, match }) => (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-[#0A0F1D] border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0">
                        {student.avatarUrl ? (
                          <Image
                            src={student.avatarUrl}
                            alt={student.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                            {student.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{student.fullName}</h4>
                        <p className="text-[10px] text-slate-400">{student.department}</p>
                      </div>
                    </div>
                    <MatchScoreBadge
                      score={match.overallScore}
                      baseScore={match.baseSkillScore}
                      bonusScore={match.bonusScore}
                      showLabel={false}
                    />
                  </div>

                  <p className="text-[11px] text-slate-300 mt-3 line-clamp-2 italic leading-relaxed">
                    &quot;{match.explanation}&quot;
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {student.skills.slice(0, 3).map((sk) => (
                      <span
                        key={sk.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                      >
                        {sk.skillName} • {PROFICIENCY_LABELS[sk.proficiency]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">{student.availability}</span>
                  <Link
                    href={`/students/${student.id}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two-Column Grid: Active Projects & Sprint Deliverables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects */}
          <div className="rounded-2xl bg-[#0F1626] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Active Project Marketplace
                </h3>
                <Link href="/projects" className="text-xs text-indigo-400 font-semibold hover:underline">
                  Browse All ({projects.length})
                </Link>
              </div>

              <div className="space-y-3 mt-4">
                {projects.slice(0, 4).map((proj) => (
                  <Link
                    key={proj.id}
                    href={`/projects/${proj.id}`}
                    className="block p-3.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/5 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                        {proj.openPositions !== undefined ? `${proj.openPositions} Positions Open` : `${proj.currentTeamSize}/${proj.maxTeamSize} Members`}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mt-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{proj.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <Link
                href="/projects/new"
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Project Opportunity</span>
              </Link>
            </div>
          </div>

          {/* Current Sprint Tasks */}
          <div className="rounded-2xl bg-[#0F1626] border border-white/10 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400" />
                  Team Sprint Deliverables ({tasks.length})
                </h3>
                <Link href="/tasks" className="text-xs text-indigo-400 font-semibold hover:underline">
                  View Board
                </Link>
              </div>

              <div className="space-y-3 mt-4">
                {tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{task.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Assignee: <strong className="text-slate-300">{task.assigneeName || "Unassigned"}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Due {task.dueDate}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        task.status === "done"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : task.status === "in_progress"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <Link
                href="/tasks"
                className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
              >
                <span>Manage Kanban Sprint Tasks</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
