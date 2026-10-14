"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Settings,
  Database,
  User,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { PROFICIENCY_LABELS, SkillProficiency, StudentProfile } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function SettingsPage() {
  const { currentStudent, updateProfile, resetAllData, isDemoMode, students, switchPersona } = useApp();

  const [activeTab, setActiveTab] = useState<"profile" | "storage">("profile");

  // Profile Form State
  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [email, setEmail] = useState(currentStudent.email);
  const [college, setCollege] = useState(currentStudent.college);
  const [department, setDepartment] = useState(currentStudent.department);
  const [academicYear, setAcademicYear] = useState(currentStudent.academicYear);
  const [bio, setBio] = useState(currentStudent.bio);
  const [availability, setAvailability] = useState(currentStudent.availability);
  const [portfolioUrl, setPortfolioUrl] = useState(currentStudent.portfolioUrl || "");
  const [githubUrl, setGithubUrl] = useState(currentStudent.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(currentStudent.linkedinUrl || "");

  // Skills
  const [skills, setSkills] = useState(currentStudent.skills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState<SkillProficiency>(2);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      {
        id: `sk-${Date.now()}`,
        skillName: newSkillName.trim(),
        proficiency: newSkillProf,
      },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...currentStudent,
      fullName: fullName.trim(),
      email: email.trim(),
      college: college.trim(),
      department: department.trim(),
      academicYear,
      bio: bio.trim(),
      availability,
      portfolioUrl: portfolioUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      skills,
    };
    updateProfile(updated);
  };

  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-4 border-b border-white/10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>Preferences & Persistence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings & Storage Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your student profile, edit declared competencies, and inspect demo persistence mode.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Technical Skills</span>
          </button>
          <button
            onClick={() => setActiveTab("storage")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "storage"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database & Demo Storage Mode</span>
          </button>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === "profile" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 shadow-2xl">
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Academic Year
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Biography & Engineering Focus
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Skills declaration section */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Declared Technical Competencies
                  </label>
                  <span className="text-[11px] text-indigo-400">
                    Used directly by Skill Matching Engine
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                    >
                      <span className="font-semibold">{s.skillName}</span>
                      <span className="text-indigo-400 font-mono text-[11px]">
                        ({PROFICIENCY_LABELS[s.proficiency]})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s.id)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <input
                    type="text"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="Add skill (e.g. Docker, GraphQL, PyTorch)"
                    className="flex-1 px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newSkillProf}
                    onChange={(e) => setNewSkillProf(Number(e.target.value) as SkillProficiency)}
                    className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={1}>1 - Beginner</option>
                    <option value={2}>2 - Intermediate</option>
                    <option value={3}>3 - Advanced</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Weekly Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="15+ hrs/week">15+ hrs/week (High Velocity)</option>
                    <option value="10-15 hrs/week">10-15 hrs/week (Standard)</option>
                    <option value="5-10 hrs/week">5-10 hrs/week (Part-Time)</option>
                    <option value="< 5 hrs/week">&lt; 5 hrs/week</option>
                    <option value="Unavailable">Unavailable for new teams</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Database & Storage Architecture Tab */}
        {activeTab === "storage" && (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 shadow-2xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Storage Mode Status & Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                SkillSync supports both live Supabase PostgreSQL production databases and a zero-dependency local browser storage engine.
              </p>
            </div>

            {/* Current Storage Mode Banner */}
            <div
              className={`p-5 rounded-2xl border ${
                isDemoMode
                  ? "bg-amber-500/10 border-amber-500/20 text-slate-300"
                  : "bg-emerald-500/10 border-emerald-500/20 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isDemoMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"
                    }`}
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Current Mode: {isDemoMode ? "Demo Mode (Local Storage)" : "Supabase PostgreSQL (Live)"}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isDemoMode
                        ? "Operating on persistent local storage with realistic sample data. Zero external database required."
                        : "Connected to remote Supabase database instance."}
                    </p>
                  </div>
                </div>
              </div>

              {isDemoMode && (
                <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs text-amber-300/90 leading-relaxed">
                  <strong>Notice:</strong> In accordance with engineering capstone standards, demo-mode records are transparently preserved in your local browser environment. Records are never falsely claimed to be stored in Supabase.
                </div>
              )}
            </div>

            {/* Supabase Connection Details & Guide */}
            <div className="p-5 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Connecting to Live Supabase
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                To connect to a live Supabase project, populate the following environment variables in a <code className="text-indigo-300 font-mono">.env.local</code> file:
              </p>
              <div className="p-3 bg-[#090D16] rounded-xl border border-white/5 font-mono text-xs text-indigo-300 space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here</div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A complete SQL migration script with Row-Level Security policies has already been generated at <code className="text-indigo-300 font-mono">supabase-schema.sql</code> in the project root.
              </p>
            </div>

            {/* Reset Data Button */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-white">Reset Local Mock Data</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Restores all student profiles, projects, teams, applications, and sprint tasks to default initial states.
                </p>
              </div>

              <button
                onClick={resetAllData}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded-xl text-xs font-semibold border border-rose-500/30 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Seed</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
