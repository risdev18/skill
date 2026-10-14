"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Building2,
  Clock,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  GraduationCap,
  Briefcase,
  X,
} from "lucide-react";
import { PROFICIENCY_LABELS, StudentProfile } from "@/types";

export default function DiscoverPage() {
  const { students, toggleShortlist } = useApp();

  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<"All" | "student" | "mentor">("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [selectedAvailability, setSelectedAvailability] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [onlyShortlisted, setOnlyShortlisted] = useState(false);
  const [sortBy, setSortBy] = useState<"skillsCount" | "name">("skillsCount");

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

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = student.fullName.toLowerCase().includes(q);
          const matchDept = student.department.toLowerCase().includes(q);
          const matchCollege = student.college.toLowerCase().includes(q);
          const matchBio = student.bio.toLowerCase().includes(q);
          const matchOrg = (student.organization || "").toLowerCase().includes(q);
          const matchSkill = student.skills.some((s) => s.skillName.toLowerCase().includes(q));
          if (!matchName && !matchDept && !matchCollege && !matchBio && !matchSkill && !matchOrg) {
            return false;
          }
        }

        if (selectedYear !== "All" && student.academicYear !== selectedYear) {
          return false;
        }

        if (selectedAvailability !== "All" && student.availability !== selectedAvailability) {
          return false;
        }

        if (selectedCategory !== "All") {
          const inPref = student.preferredCategories?.includes(selectedCategory);
          const inSkills = student.skills.some((s) => s.category === selectedCategory);
          if (!inPref && !inSkills) return false;
        }

        if (onlyShortlisted && !student.shortlisted) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "skillsCount") {
          return b.skills.length - a.skills.length;
        }
        return a.fullName.localeCompare(b.fullName);
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Student & Mentor Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Search {students.length} preloaded engineering peers & club mentors by technical skills, branch, and availability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyShortlisted(!onlyShortlisted)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                onlyShortlisted
                  ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Shortlisted ({students.filter((s) => s.shortlisted).length})</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
          {/* Role Filter Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
            <button
              onClick={() => setSelectedRole("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === "All"
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Profiles ({students.length})
            </button>
            <button
              onClick={() => setSelectedRole("student")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedRole === "student"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Students Only ({students.filter(s => s.userRole !== 'recruiter' && s.userRole !== 'project_owner').length})</span>
            </button>
            <button
              onClick={() => setSelectedRole("mentor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedRole === "mentor"
                  ? "bg-white text-amber-800 shadow-xs border border-slate-200 font-bold"
                  : "text-slate-600 hover:text-slate-900"
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
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
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
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="All">All Availabilities</option>
                <option value="15+ hrs/week">15+ hrs/week</option>
                <option value="10-15 hrs/week">10-15 hrs/week</option>
                <option value="5-10 hrs/week">5-10 hrs/week</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="skillsCount">Sort: Most Skills</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>

          {isFiltered && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Filters active
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredStudents.length}</strong> matching profiles
          </span>
        </div>

        {/* Cards Grid */}
        {filteredStudents.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">No profiles match your search criteria</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your query or resetting filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors"
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
                  className={`p-5 rounded-2xl bg-white border transition-all flex flex-col justify-between group shadow-xs hover:shadow-md ${
                    isMentor
                      ? "border-amber-200 hover:border-amber-400"
                      : "border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  <div>
                    {/* Top Bar: Avatar, Name, Role Badge, Shortlist Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                          {student.avatarUrl ? (
                            <Image
                              src={student.avatarUrl}
                              alt={student.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-700 text-sm">
                              {student.fullName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {student.fullName}
                            </h3>
                            {isMentor && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                Mentor
                              </span>
                            )}
                          </div>

                          {student.organization ? (
                            <p className="text-xs text-amber-800 font-semibold truncate mt-0.5">
                              {student.organization}
                            </p>
                          ) : (
                            <p className="text-xs text-indigo-700 font-medium truncate mt-0.5">
                              {student.department}
                            </p>
                          )}

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{student.college}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleShortlist(student.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          student.shortlisted
                            ? "bg-indigo-600 text-white border-indigo-500"
                            : "bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
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
                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {student.bio}
                    </p>

                    {/* Verified Skills */}
                    <div className="mt-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {isMentor ? "Project Technical Requirements" : "Verified Skills & Proficiency"}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {student.skills.map((s) => {
                          let profClass = "bg-slate-100 text-slate-700 border-slate-200";
                          if (s.proficiency === 3) {
                            profClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                          } else if (s.proficiency === 2) {
                            profClass = "bg-purple-50 text-purple-700 border-purple-200";
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
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                        <span className="text-slate-400 font-medium">Domain:</span>
                        <span className="truncate text-slate-700 font-medium">{student.preferredCategories.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: Availability & Action Button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{student.availability}</span>
                    </div>

                    <Link
                      href={`/students/${student.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
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
