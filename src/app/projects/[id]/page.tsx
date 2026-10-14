"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Users,
  Clock,
  Sparkles,
  ArrowLeft,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  Send,
  Building2,
  CheckSquare,
  UserCheck,
} from "lucide-react";
import { ApplicationModal } from "@/components/ApplicationModal";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { ApplicationStatus, PROFICIENCY_LABELS } from "@/types";
import { calculateMatchScore } from "@/lib/matching";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const {
    projects,
    currentStudent,
    applications,
    updateApplicationStatus,
    teams,
  } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  const team = teams.find((t) => t.projectId === projectId);
  const projectApplications = applications.filter((a) => a.projectId === projectId);

  if (!project) {
    return (
      <AppShell>
        <div className="p-12 text-center">
          <h2 className="text-lg font-bold text-white">Project Not Found</h2>
          <Link
            href="/projects"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isOwner = project.ownerId === currentStudent.id;
  const userApplication = applications.find(
    (a) => a.projectId === project.id && a.studentId === currentStudent.id
  );
  const isFull = project.currentTeamSize >= project.maxTeamSize;

  // Calculate current student's match score against this project
  const userMatchScore = calculateMatchScore(project.requiredSkills, currentStudent, {
    projectCategory: project.category,
    experiencePreference: project.experiencePreference,
  });

  return (
    <AppShell>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
        {/* Top Back Navigation */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                  {project.category}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  {project.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                <span>
                  Project Owner: <strong className="text-white">{project.ownerName}</strong> ({project.ownerCollege})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  {project.duration}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {project.currentTeamSize} / {project.maxTeamSize} Members
                </span>
              </div>
            </div>

            {/* Match Engine CTA or Apply CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/matching?project=${project.id}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all w-full sm:w-auto justify-center"
              >
                <Cpu className="w-4 h-4" />
                <span>Find Candidates (Matching)</span>
              </Link>

              {!isOwner && !userApplication && (
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  disabled={isFull}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-md w-full sm:w-auto"
                >
                  {isFull ? "Team Full" : "Apply to Join"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Project Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </div>
        </div>

        {/* Required Skills & Weights */}
        <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Required Technical Proficiencies
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated deterministically by the Skill Matching Engine
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400">
              Target Level: {project.experiencePreference}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {project.requiredSkills.map((req) => (
              <div
                key={req.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
              >
                <div className="font-bold text-sm text-white">{req.skillName}</div>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Weight: <strong className="text-white">{req.weight}%</strong></span>
                  <span className="text-indigo-400 font-medium">
                    Min: {PROFICIENCY_LABELS[req.minimumProficiency]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Roster */}
        {team && (
          <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Current Team Roster ({team.members.length} / {project.maxTeamSize})
              </h3>
              <Link
                href={`/teams/${team.id}`}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Open Team Gap Analyzer →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {team.members.map((member) => (
                <div
                  key={member.studentId}
                  className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0">
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
                    <p className="text-[10px] text-indigo-400 truncate">{member.role}</p>
                    <p className="text-[10px] text-slate-500 truncate">{member.student.college}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Section: If user is Owner, show all applicants with accept/reject controls */}
        {isOwner && (
          <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Candidate Applications ({projectApplications.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review student pitches and calculated skill compatibility before confirming team spots
                </p>
              </div>
              {isFull && (
                <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  Team is full ({project.maxTeamSize}/{project.maxTeamSize})
                </span>
              )}
            </div>

            {projectApplications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No students have applied to this project yet. Use the Matching Engine to discover candidates!
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {projectApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0">
                        {app.student.avatarUrl ? (
                          <Image
                            src={app.student.avatarUrl}
                            alt={app.student.fullName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-white text-xs">
                            {app.student.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{app.student.fullName}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              app.status === "Accepted"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : app.status === "Rejected"
                                ? "bg-rose-500/20 text-rose-400"
                                : app.status === "Withdrawn"
                                ? "bg-slate-800 text-slate-400"
                                : "bg-indigo-500/20 text-indigo-400"
                            }`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {app.student.department} • {app.student.college}
                        </p>
                        <p className="text-xs text-slate-300 mt-2 bg-white/5 p-2 rounded-lg italic">
                          &quot;{app.pitch}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
                      {app.matchScore && (
                        <MatchScoreBadge score={app.matchScore} size="sm" />
                      )}

                      {app.status === "Pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, "Accepted")}
                            disabled={isFull}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, "Rejected")}
                            className="px-3 py-1.5 bg-white/5 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-white/5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Student's Application Status (if not owner) */}
        {!isOwner && userApplication && (
          <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Your Application Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                  {userApplication.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 italic">
                Pitch submitted: &quot;{userApplication.pitch}&quot;
              </p>
            </div>

            {userApplication.status === "Pending" && (
              <button
                onClick={() => updateApplicationStatus(userApplication.id, "Withdrawn")}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
              >
                Withdraw Pitch
              </button>
            )}
          </div>
        )}
      </div>

      <ApplicationModal
        project={project}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        calculatedMatchScore={userMatchScore.overallScore}
      />
    </AppShell>
  );
}
