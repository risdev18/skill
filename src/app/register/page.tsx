"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Plus, Trash2, AlertCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SkillProficiency, StudentSkill, StudentProfile } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { isDemoMode, updateProfile, switchPersona, showToast } = useApp();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState<StudentProfile["academicYear"]>("2nd Year");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState<StudentProfile["availability"]>("10-15 hrs/week");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [skills, setSkills] = useState<{ skillName: string; proficiency: SkillProficiency }[]>([
    { skillName: "Python", proficiency: 2 },
    { skillName: "React", proficiency: 2 },
  ]);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillProf, setNewSkillProf] = useState<SkillProficiency>(2);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills((prev) => [
      ...prev,
      { skillName: newSkillName.trim(), proficiency: newSkillProf },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !college.trim()) {
      setError("Please fill out your Full Name, Email, and College.");
      return;
    }
    if (skills.length === 0) {
      setError("Please declare at least one technical skill.");
      return;
    }

    const newStudent: StudentProfile = {
      id: `student-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250",
      college: college.trim(),
      department: department.trim() || "Computer Engineering",
      academicYear,
      bio: bio.trim() || "Engineering student excited to collaborate on innovative projects.",
      skills: skills.map((s, idx) => ({
        id: `sk-${idx}-${Date.now()}`,
        skillName: s.skillName,
        proficiency: s.proficiency,
      })),
      interests: ["Full-Stack", "Machine Learning"],
      preferredCategories: ["Web Development", "AI and Machine Learning"],
      availability,
      portfolioUrl: portfolioUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      linkedinUrl: linkedinUrl.trim() || undefined,
      visibility: "public",
      activeProjectsCount: 0,
      shortlisted: false,
    };

    updateProfile(newStudent);
    switchPersona(newStudent.id);
    showToast("Profile Created!", "Your student technical profile has been saved.", "success");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#090D16] py-12 px-4 sm:px-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">SkillSync</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Create Student Profile</h2>
          <p className="text-xs text-slate-400 mt-1">Declare your skills and find the right teammates</p>
        </div>

        {isDemoMode && (
          <div className="mb-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              <strong>Demo Storage Active:</strong> Profiles created here persist in browser storage and can be matched against all projects.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                University Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan.lee@college.edu"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                College / University *
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. University of Washington"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                placeholder="e.g. Computer Science"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
              Short Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What kind of engineering systems are you eager to build?"
              className="w-full px-3.5 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Technical Skills Declaration */}
          <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Technical Skills & Verified Proficiency *
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                >
                  <span className="font-medium">{s.skillName}</span>
                  <span className="text-[10px] text-indigo-400 font-mono">
                    ({s.proficiency === 1 ? "Beginner" : s.proficiency === 2 ? "Intermediate" : "Advanced"})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="text-slate-400 hover:text-rose-400 ml-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="Skill name (e.g. Next.js, C++, PyTorch)"
                className="flex-1 px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
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
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Availability
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
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white">
              Already have an account? Sign In
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
