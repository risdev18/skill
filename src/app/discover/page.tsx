"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  Briefcase,
  GraduationCap,
  X,
} from "lucide-react";
import { PROFICIENCY_LABELS } from "@/types";

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const filterParam = searchParams.get("filter") || "";

  const { students, toggleShortlist } = useApp();

  const [search, setSearch] = useState(initialQuery);
  const [selectedRole, setSelectedRole] = useState<"All" | "student" | "mentor">("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [onlyShortlisted, setOnlyShortlisted] = useState<boolean>(filterParam === "shortlisted");
  const [sortBy, setSortBy] = useState<"name" | "skillsCount">("skillsCount");

  const skillCategories = [
    "All",
    "Frontend",
    "Backend",
    "AI/ML",
    "Languages",
    "Database",
    "Data Science",
    "Hardware",
    "Design",
  ];

  const filteredStudents = useMemo(() => {
    return students
      .filter((student) => {
        // Role filter
        if (selectedRole === "student" && (student.userRole === "recruiter" || student.userRole === "project_owner")) {
          return false;
        }
        if (selectedRole === "mentor" && student.userRole !== "recruiter" && student.userRole !== "project_owner") {
          return false;
        }

        // Search query across name, college, department, organization, skills, and bio
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = student.fullName.toLowerCase().includes(q);
          const matchCollege = student.college.toLowerCase().includes(q);
          const matchDept = student.department.toLowerCase().includes(q);
          const matchOrg = student.organization?.toLowerCase().includes(q) || false;
          const matchBio = student.bio.toLowerCase().includes(q);
          const matchSkills = student.skills.some((s) => s.skillName.toLowerCase().includes(q));
          const matchInterests = student.interests.some((i) => i.toLowerCase().includes(q));

          if (!matchName && !matchCollege && !matchDept && !matchOrg && !matchBio && !matchSkills && !matchInterests) {
            return false;
          }
        }

        // Academic Year filter
        if (selectedYear !== "All" && student.academicYear !== selectedYear) {
          return false;
        }

        // Availability filter
        if (selectedAvailability !== "All" && student.availability !== selectedAvailability) {
          return false;
        }

        // Shortlisted only filter
        if (onlyShortlisted && !student.shortlisted) {
          return false;
        }

        // Skill category filter
        if (selectedCategory !== "All") {
          const hasCategory = student.skills.some((s) => s.category === selectedCategory);
          if (!hasCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "skillsCount") {
          return b.skills.length - a.skills.length;
        }
        if (sortBy === "name") {
          return a.fullName.localeCompare(b.fullName);
        }
        return 0;
      });
  }, [
    students,
    selectedRole,
    search,
    selectedYear,
    selectedAvailability,
    selectedCategory,
    onlyShortlisted,
    sortBy,
  ]);

  const clearAllFilters = () => {
    setSearch("");
    setSelectedRole("All");
    setSelectedYear("All");
    setSelectedAvailability("All");
    setSelectedCategory("All");
    setOnlyShortlisted(false);
  };

  const isFiltered =
    search.trim() !== "" ||
    selectedRole !== "All" ||
    selectedYear !== "All" ||
    selectedAvailability !== "All" ||
    selectedCategory !== "All" ||
    onlyShortlisted;

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Student & Mentor Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search {students.length} preloaded engineering peers & club mentors by technical skills, branch, and availability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyShortlisted(!onlyShortlisted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                onlyShortlisted
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Shortlisted ({students.filter((s) => s.shortlisted).length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-[#0F1626] border border-white/10 space-y-4 shadow-xl">
          {/* Role Filter Tabs */}
          <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => setSelectedRole("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === "All"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Profiles ({students.length})
            </button>
            <button
              onClick={() => setSelectedRole("student")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedRole === "student"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Students Only ({students.filter(s => s.userRole !== 'recruiter' && s.userRole !== 'project_owner').length})</span>
            </button>
            <button
              onClick={() => setSelectedRole("mentor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedRole === "mentor"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Project Creators & Mentors ({students.filter(s => s.userRole === 'recruiter' || s.userRole === 'project_owner').length})</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, skill (Python, SQL, React, ML, C, Java), college, or branch..."
                className="w-full pl-9 pr-4 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Availabilities</option>
                <option value="15+ hrs/week">15+ hrs/week</option>
                <option value="10-15 hrs/week">10-15 hrs/week</option>
                <option value="5-10 hrs/week">5-10 hrs/week</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="skillsCount">Sort: Most Skills</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {/* Quick Skill Category Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
            <span className="text-[11px] text-slate-400 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-slate-500" />
              Skill Domain:
            </span>
            {skillCategories.map((cat) => (
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

            {isFiltered && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-rose-400 hover:text-rose-300 ml-auto font-medium"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredStudents.length}</strong> matching profiles
          </span>
        </div>

        {/* Cards Grid */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0F1626] border border-white/10 text-center">
            <h3 className="text-sm font-bold text-white">No profiles match your search criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStudents.map((student) => {
              const isMentor = student.userRole === "recruiter" || student.userRole === "project_owner";

              return (
                <div
                  key={student.id}
                  className={`p-5 rounded-2xl bg-[#0F1626] border transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl ${
                    isMentor
                      ? "border-amber-500/20 hover:border-amber-500/50"
                      : "border-white/10 hover:border-indigo-500/40"
                  }`}
                >
                  <div>
                    {/* Top Bar: Avatar, Name, Role Badge, Shortlist Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                          {student.avatarUrl ? (
                            <Image
                              src={student.avatarUrl}
                              alt={student.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-white text-sm">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {student.fullName}
                            </h3>
                            {isMentor && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Mentor
                              </span>
                            )}
                          </div>

                          {student.organization ? (
                            <p className="text-xs text-amber-400 font-semibold truncate mt-0.5">
                              {student.organization}
                            </p>
                          ) : (
                            <p className="text-xs text-indigo-400 font-medium truncate mt-0.5">
                              {student.department}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{student.college}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleShortlist(student.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          student.shortlisted
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-white/5 text-slate-400 hover:text-white border-white/10 hover:bg-white/10"
                        }`}
                        title={student.shortlisted ? "Remove from shortlist" : "Add to shortlist"}
                      >
                        {student.shortlisted ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      {student.bio}
                    </p>

                    {/* Verified Skills */}
                    <div className="mt-4">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        {isMentor ? "Project Technical Requirements" : "Verified Skills & Proficiency"}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.map((s) => {
                          let profClass = "bg-slate-800/80 text-slate-300 border-white/5";
                          if (s.proficiency === 3) {
                            profClass = "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
                          } else if (s.proficiency === 2) {
                            profClass = "bg-purple-500/10 text-purple-300 border-purple-500/20";
                          }
                          return (
                            <span
                              key={s.id}
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${profClass}`}
                            >
                              {s.skillName} • {PROFICIENCY_LABELS[s.proficiency]}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preferred Categories */}
                    {student.preferredCategories && student.preferredCategories.length > 0 && (
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="text-slate-500 font-medium">Domain:</span>
                        <span className="truncate text-slate-300">{student.preferredCategories.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: Availability & Action Button */}
                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{student.availability}</span>
                    </div>

                    <Link
                      href={`/students/${student.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
