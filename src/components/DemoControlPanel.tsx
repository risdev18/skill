"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  RotateCcw,
  Sparkles,
  Database,
  CheckCircle2,
  AlertTriangle,
  X,
  UserCheck,
  Briefcase,
  Layers,
  ShieldCheck,
  Download,
} from "lucide-react";

interface DemoControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoControlPanel({ isOpen, onClose }: DemoControlPanelProps) {
  const {
    isDemoMode,
    students,
    projects,
    tasks,
    applications,
    teams,
    resetAllData,
    currentStudent,
    switchPersona,
    showToast,
  } = useApp();

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    resetAllData();
    setShowConfirmReset(false);
    showToast("Demo Data Restored", "All 21 profiles, 8 capstone projects, teams, tasks, and applications have been re-seeded.", "success");
    onClose();
  };

  const recruiters = students.filter(
    (s) => s.userRole === "recruiter" || s.userRole === "project_owner"
  );
  const regularStudents = students.filter(
    (s) => s.userRole !== "recruiter" && s.userRole !== "project_owner"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  SkillSync Demonstration Control Panel
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prepared for College Project & Capstone Faculty Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Storage Information */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Storage Engine: LocalStorage Reactive Seed (Zero-Dependency)</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Data persists across page reloads. Supabase is optional and ready via <code className="text-indigo-300">supabase-schema.sql</code>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl text-xs font-semibold border border-rose-500/30 transition-all shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 p-1 bg-rose-500/10 rounded-xl border border-rose-500/20">
                  <span className="text-[11px] text-rose-300 font-medium px-2">Confirm?</span>
                  <button
                    onClick={handleConfirmReset}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-500"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 bg-white/5 text-slate-400 rounded-lg text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dataset Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px]">Total Profiles</span>
              <div className="text-lg font-bold text-white mt-1">
                {students.length} <span className="text-[10px] text-indigo-400 font-normal">({regularStudents.length} Students + {recruiters.length} Mentors)</span>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px]">Demo Projects</span>
              <div className="text-lg font-bold text-indigo-400 mt-1">{projects.length} Projects</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px]">Active Teams</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">{teams.length} Teams</div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-slate-400 text-[11px]">Sprint Tasks</span>
              <div className="text-lg font-bold text-amber-400 mt-1">{tasks.length} Tasks</div>
            </div>
          </div>

          {/* Quick Switch to Recruiter/Project Owner Persona */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>Project Creators & Club Mentors (Test Reviewing Applications)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recruiters.map((owner) => {
                const isCurrent = owner.id === currentStudent.id;
                return (
                  <button
                    key={owner.id}
                    onClick={() => {
                      switchPersona(owner.id);
                      onClose();
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isCurrent
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-black/30 border-white/5 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs truncate text-white">{owner.fullName}</div>
                      <div className="text-[10px] text-indigo-400 truncate">{owner.organization}</div>
                      <div className="text-[9px] text-slate-400 truncate">{owner.roleTitle}</div>
                    </div>
                    {isCurrent ? (
                      <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-indigo-400 font-semibold hover:underline shrink-0">
                        Switch
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Switch to Student Persona */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Builder Personas (Test Applying & Matching)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {regularStudents.slice(0, 8).map((student) => {
                const isCurrent = student.id === currentStudent.id;
                return (
                  <button
                    key={student.id}
                    onClick={() => {
                      switchPersona(student.id);
                      onClose();
                    }}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-black/30 border-white/5 hover:border-white/20 text-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-xs truncate text-white">{student.fullName}</div>
                    <div className="text-[10px] text-slate-400 truncate">{student.department}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Active Identity: <strong className="text-white">{currentStudent.fullName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
