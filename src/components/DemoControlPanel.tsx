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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  SkillSync Demonstration Control Panel
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Demo Mode
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Prepared for College Project & Capstone Faculty Demonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Storage Information */}
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Storage Engine: LocalStorage Reactive Seed (Zero-Dependency)</span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Data persists across page reloads. Supabase is optional and ready via <code className="text-indigo-700 font-semibold font-mono">supabase-schema.sql</code>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!showConfirmReset ? (
                <button
                  onClick={() => setShowConfirmReset(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold border border-rose-200 transition-all shrink-0 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reset Demo Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 p-1 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[11px] text-rose-700 font-medium px-2">Confirm?</span>
                  <button
                    onClick={handleConfirmReset}
                    className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-xs font-bold hover:bg-rose-700 shadow-xs"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2 py-1 bg-white text-slate-600 border border-slate-200 rounded-lg text-xs hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Dataset Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-semibold">Total Profiles</span>
              <div className="text-lg font-bold text-slate-900 mt-1">
                {students.length} <span className="text-[10px] text-indigo-700 font-medium">({regularStudents.length} Students + {recruiters.length} Mentors)</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-semibold">Demo Projects</span>
              <div className="text-lg font-bold text-indigo-700 mt-1">{projects.length} Projects</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-semibold">Active Teams</span>
              <div className="text-lg font-bold text-emerald-700 mt-1">{teams.length} Teams</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 text-[11px] font-semibold">Sprint Tasks</span>
              <div className="text-lg font-bold text-amber-800 mt-1">{tasks.length} Tasks</div>
            </div>
          </div>

          {/* Quick Switch to Recruiter/Project Owner Persona */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
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
                        ? "bg-indigo-50/80 border-indigo-400 text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700"
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-xs truncate text-slate-900">{owner.fullName}</div>
                      <div className="text-[10px] text-indigo-700 font-medium truncate">{owner.organization}</div>
                      <div className="text-[9px] text-slate-500 truncate">{owner.roleTitle}</div>
                    </div>
                    {isCurrent ? (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-indigo-600 font-semibold hover:underline shrink-0">
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
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
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
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? "bg-indigo-50/80 border-indigo-400 text-slate-900 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-indigo-300 text-slate-700"
                    }`}
                  >
                    <div className="font-bold text-xs truncate text-slate-900">{student.fullName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{student.department}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Active Identity: <strong className="text-slate-900 font-bold">{currentStudent.fullName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
