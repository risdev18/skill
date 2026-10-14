"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Info,
} from "lucide-react";
import { Project, ProjectCategory, RequiredSkill, SkillProficiency } from "@/types";
import { validateAndNormalizeWeights } from "@/lib/matching";

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject, currentStudent } = useApp();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("Web Development");
  const [maxTeamSize, setMaxTeamSize] = useState<number>(4);
  const [duration, setDuration] = useState("8 weeks");
  const [experiencePreference, setExperiencePreference] = useState<Project["experiencePreference"]>("All Levels");
  const [deadline, setDeadline] = useState("2026-12-01");

  const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([
    { id: "req-init-1", skillName: "React", weight: 40, minimumProficiency: 2 },
    { id: "req-init-2", skillName: "TypeScript", weight: 30, minimumProficiency: 2 },
    { id: "req-init-3", skillName: "Node.js", weight: 30, minimumProficiency: 1 },
  ]);

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillWeight, setNewSkillWeight] = useState(25);
  const [newSkillProf, setNewSkillProf] = useState<SkillProficiency>(2);
  const [error, setError] = useState<string | null>(null);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills((prev) => [
      ...prev,
      {
        id: `req-${Date.now()}`,
        skillName: newSkillName.trim(),
        weight: Number(newSkillWeight) || 20,
        minimumProficiency: newSkillProf,
      },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (id: string) => {
    setRequiredSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please provide a project title and description.");
      return;
    }

    if (requiredSkills.length === 0) {
      setError("Please specify at least one required skill for the project.");
      return;
    }

    const val = validateAndNormalizeWeights(requiredSkills);
    if (!val.isValid) {
      setError(val.error || "Invalid skill weights.");
      return;
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      ownerId: currentStudent.id,
      ownerName: currentStudent.fullName,
      ownerCollege: currentStudent.college,
      requiredSkills,
      maxTeamSize,
      currentTeamSize: 1,
      openPositions: Math.max(0, maxTeamSize - 1),
      duration,
      experiencePreference,
      deadline,
      status: "Open",
      createdAt: new Date().toISOString(),
    };

    createProject(newProject);
    router.push(`/projects/${newProject.id}`);
  };

  const categories: ProjectCategory[] = [
    "Web Development",
    "AI and Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Mobile Development",
    "IoT",
    "Open Source",
    "Research",
    "Other",
  ];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="pb-5 border-b border-slate-200">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Create New Project Opportunity
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Define your capstone vision, required technical proficiencies, and team capacity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Autonomous Robotic Arm for Surgical Training"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Description & Goals *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem, target deliverables, architecture, and what students will learn..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Maximum Team Size
                </label>
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 10 weeks"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience Preference
                </label>
                <select
                  value={experiencePreference}
                  onChange={(e) => setExperiencePreference(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value="All Levels">All Levels Welcome</option>
                  <option value="Intermediate+">Intermediate+</option>
                  <option value="Advanced Only">Advanced Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Required Skills Builder */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Required Skills & Importance Weights *
                </label>
                <span className="text-[11px] text-indigo-600 font-mono font-medium">
                  Weights normalized automatically to 100%
                </span>
              </div>

              <div className="space-y-2">
                {requiredSkills.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 shadow-xs"
                  >
                    <div className="font-semibold text-slate-900">{req.skillName}</div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">
                        Weight: <strong className="text-slate-900">{req.weight}%</strong>
                      </span>
                      <span className="text-indigo-600 font-medium text-[11px]">
                        Min Prof: {req.minimumProficiency === 1 ? "Beginner" : req.minimumProficiency === 2 ? "Intermediate" : "Advanced"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(req.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Skill Row */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. PyTorch, Rust, Next.js)"
                  className="flex-1 min-w-[160px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={newSkillWeight}
                  onChange={(e) => setNewSkillWeight(Number(e.target.value))}
                  placeholder="Weight"
                  title="Importance Weight"
                  className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                />
                <select
                  value={newSkillProf}
                  onChange={(e) => setNewSkillProf(Number(e.target.value) as SkillProficiency)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  <option value={1}>Min: Beginner</option>
                  <option value={2}>Min: Intermediate</option>
                  <option value={3}>Min: Advanced</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Skill</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <Link
                href="/projects"
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all"
              >
                Publish Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
