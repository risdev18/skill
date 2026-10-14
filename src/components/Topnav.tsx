"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  PlusCircle,
  Sparkles,
  BookmarkCheck,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PersonaSwitcherModal } from "./PersonaSwitcherModal";
import { DemoControlPanel } from "./DemoControlPanel";

export function Topnav() {
  const router = useRouter();
  const { currentStudent, students } = useApp();
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isDemoControlOpen, setIsDemoControlOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const shortlistedCount = students.filter((s) => s.shortlisted).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students, skills (e.g. Python, SQL, React, ML)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100/90 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </form>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 ml-auto">
          {/* Demo Control Panel Button */}
          <button
            onClick={() => setIsDemoControlOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-all shadow-2xs"
            title="Open Demo Control Panel & Reset Dataset"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Demo Control</span>
            <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1 rounded font-mono font-bold">v3</span>
          </button>

          {/* Quick Create Project Button */}
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Project</span>
          </Link>

          {/* Shortlisted Quick Link */}
          <Link
            href="/discover?filter=shortlisted"
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            title="Shortlisted candidates"
          >
            <BookmarkCheck className="w-4 h-4" />
            {shortlistedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-indigo-600 text-[9px] font-bold text-white flex items-center justify-center">
                {shortlistedCount}
              </span>
            )}
          </Link>

          {/* Persona Dropdown Pill */}
          <button
            onClick={() => setIsPersonaOpen(true)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors shadow-2xs"
            title="Switch Active Persona"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
              {currentStudent.avatarUrl ? (
                <Image
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.fullName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-700">
                  {currentStudent.fullName.charAt(0)}
                </div>
              )}
            </div>
            <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[120px] truncate">
              {currentStudent.fullName}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
        </div>
      </header>

      <PersonaSwitcherModal
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
      />
      <DemoControlPanel
        isOpen={isDemoControlOpen}
        onClose={() => setIsDemoControlOpen(false)}
      />
    </>
  );
}
