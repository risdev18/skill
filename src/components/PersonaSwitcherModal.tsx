"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, UserCheck, Sparkles, Building2, Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";

interface PersonaSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonaSwitcherModal({ isOpen, onClose }: PersonaSwitcherModalProps) {
  const { students, currentStudent, switchPersona } = useApp();
  const [activeTab, setActiveTab] = useState<"students" | "recruiters">("students");

  if (!isOpen) return null;

  const recruiters = students.filter(
    (s) => s.userRole === "recruiter" || s.userRole === "project_owner"
  );
  const regularStudents = students.filter(
    (s) => s.userRole !== "recruiter" && s.userRole !== "project_owner"
  );

  const displayedList = activeTab === "students" ? regularStudents : recruiters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Switch Identity Persona
              </h3>
              <p className="text-xs text-slate-400">
                Experience SkillSync as an Applicant, Specialist, or Project Owner/Club Recruiter
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

        {/* Role Category Tabs */}
        <div className="flex gap-2 mt-4 p-1 bg-black/40 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "students"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Builders ({regularStudents.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("recruiters")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "recruiters"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Project Creators & Mentors ({recruiters.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {displayedList.map((student) => {
            const isCurrent = student.id === currentStudent.id;
            return (
              <div
                key={student.id}
                onClick={() => {
                  switchPersona(student.id);
                  onClose();
                }}
                className={`group relative p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isCurrent
                    ? "bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                    : "bg-[#141C2E] border-white/5 hover:border-white/20 hover:bg-[#18233A]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                    {student.avatarUrl ? (
                      <Image
                        src={student.avatarUrl}
                        alt={student.fullName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-300">
                        {student.fullName.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {student.fullName}
                      </h4>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20 shrink-0">
                          <UserCheck className="w-2.5 h-2.5" />
                          Active
                        </span>
                      )}
                    </div>
                    {student.organization ? (
                      <p className="text-[10px] text-amber-400 font-semibold truncate mt-0.5">
                        {student.organization}
                      </p>
                    ) : (
                      <p className="text-[10px] text-indigo-400 font-medium truncate mt-0.5">
                        {student.department}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <Building2 className="w-3 h-3 shrink-0 text-slate-500" />
                      <span className="truncate">{student.college}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {student.skills.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5"
                    >
                      {s.skillName} (Lvl {s.proficiency})
                    </span>
                  ))}
                  {student.skills.length > 3 && (
                    <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-slate-400">
                      +{student.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-white/10 flex justify-between items-center text-xs text-slate-400">
          <span>Active: <strong className="text-white">{currentStudent.fullName}</strong> ({currentStudent.userRole === "recruiter" ? "Recruiter" : currentStudent.userRole === "project_owner" ? "Project Owner" : "Student"})</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
