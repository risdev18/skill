"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Search,
  Users,
  Clock,
  Sparkles,
  PlusCircle,
  Cpu,
  Layers,
  ChevronRight,
  UserCheck,
} from "lucide-react";
import { Project, ProjectCategory } from "@/types";
import { ApplicationModal } from "@/components/ApplicationModal";

export default function ProjectsPage() {
  const { projects, currentStudent, applications } = useApp();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [experienceLevel, setExperienceLevel] = useState<string>("All");
  const [onlyOpen, setOnlyOpen] = useState(true);

  // Application Modal state
  const [activeApplyProject, setActiveApplyProject] = useState<Project | null>(null);

  const categories: ("All" | ProjectCategory)[] = [
    "All",
    "Web Development",
    "AI and Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Mobile Development",
    "IoT",
    "Open Source",
    "Research",
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = proj.title.toLowerCase().includes(q);
        const matchDesc = proj.description.toLowerCase().includes(q);
        const matchOwner = proj.ownerName.toLowerCase().includes(q);
        const matchSkills = proj.requiredSkills.some((s) => s.skillName.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchOwner && !matchSkills) return false;
      }

      if (selectedCategory !== "All" && proj.category !== selectedCategory) {
        return false;
      }

      if (experienceLevel !== "All" && proj.experiencePreference !== experienceLevel) {
        return false;
      }

      if (onlyOpen && proj.status !== "Open") {
        return false;
      }

      return true;
    });
  }, [projects, search, selectedCategory, experienceLevel, onlyOpen]);

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Project Marketplace
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore {projects.length} college capstones, research lab initiatives, and student hackathon teams
            </p>
          </div>

          <Link
            href="/projects/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Project</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-white/10 space-y-3 shadow-xl">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search project title (Plant Disease, Expense Tracker, Medicine Reminder...), tech requirements, owner..."
                className="w-full pl-9 pr-4 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Experience Levels</option>
                <option value="All Levels">All Levels Welcome</option>
                <option value="Intermediate+">Intermediate+</option>
                <option value="Advanced Only">Advanced Only</option>
              </select>

              <button
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  onlyOpen
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : "bg-white/5 text-slate-400 border-white/10"
                }`}
              >
                Open Only ({projects.filter((p) => p.status === "Open").length})
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-lg transition-colors font-medium ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0F1626] border border-white/10 text-center">
            <h3 className="text-sm font-bold text-white">No projects found</h3>
            <p className="text-xs text-slate-400 mt-1">Try relaxing your category or search filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProjects.map((proj) => {
              const isOwner = proj.ownerId === currentStudent.id;
              const hasApplied = applications.some(
                (a) => a.projectId === proj.id && a.studentId === currentStudent.id
              );
              const openCount = proj.openPositions !== undefined ? proj.openPositions : Math.max(0, proj.maxTeamSize - proj.currentTeamSize);
              const isFull = openCount === 0;

              return (
                <div
                  key={proj.id}
                  className="p-5 sm:p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
                >
                  <div>
                    {/* Header: Category & Capacity */}
                    <div className="flex items-center justify-between pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400 font-mono text-[11px]">
                          {proj.currentTeamSize} / {proj.maxTeamSize} Members
                        </span>
                        {!isFull ? (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            {openCount} Open Positions
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                            Team Full
                          </span>
                        )}
                      </div>
                    </div>

                    <Link href={`/projects/${proj.id}`}>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors mt-2">
                        {proj.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Required Skills */}
                    <div className="mt-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Required Skills (Importance Weights)
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.requiredSkills.map((req) => (
                          <span
                            key={req.id}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 font-medium"
                          >
                            {req.skillName} • {req.weight}%
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                      <div>
                        Owner: <strong className="text-slate-300">{proj.ownerName}</strong> ({proj.ownerCollege})
                      </div>
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        <span>{proj.duration} • Due {proj.deadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                    <Link
                      href={`/matching?project=${proj.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>Match Students</span>
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${proj.id}`}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
                      >
                        Details & Roster
                      </Link>

                      {isOwner ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          Your Project
                        </span>
                      ) : hasApplied ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Applied
                        </span>
                      ) : isFull ? (
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-500 cursor-not-allowed">
                          Team Full
                        </span>
                      ) : (
                        <button
                          onClick={() => setActiveApplyProject(proj)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
                        >
                          Apply to Join
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply to Project Modal */}
      <ApplicationModal
        project={activeApplyProject}
        isOpen={!!activeApplyProject}
        onClose={() => setActiveApplyProject(null)}
      />
    </AppShell>
  );
}
