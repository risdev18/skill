"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Cpu,
  ShieldAlert,
  CheckSquare,
  BarChart3,
  Settings,
  Sparkles,
  Database,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { PersonaSwitcherModal } from "./PersonaSwitcherModal";
import { ExplainabilityModal } from "./ExplainabilityModal";

export function Sidebar() {
  const pathname = usePathname();
  const { currentStudent, isDemoMode, students } = useApp();
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Discover Students", href: "/discover", icon: Users },
    { name: "Projects", href: "/projects", icon: Briefcase },
    {
      name: "Skill Matching Engine",
      href: "/matching",
      icon: Cpu,
      badge: "Core AI",
      highlight: true,
    },
    { name: "Teams & Skill Gaps", href: "/teams", icon: ShieldAlert },
    { name: "Tasks Board", href: "/tasks", icon: CheckSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const shortlistedCount = students.filter((s) => s.shortlisted).length;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 rounded-xl bg-[#0F1626] border border-white/10 text-slate-300 hover:text-white shadow-lg"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-[#090D16] border-r border-white/10 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                SkillSync
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">
                Engineering Team Matcher
              </p>
            </div>
          </Link>
        </div>

        {/* Storage Mode Status Pill */}
        <div className="px-4 py-2.5 border-b border-white/5 bg-[#0B101D]">
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors group"
          >
            <div className="flex items-center gap-2 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
              <span className="text-slate-300 font-medium">
                {isDemoMode ? "Demo Mode (Local)" : "Supabase Live"}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm"
                    : item.highlight
                    ? "text-slate-200 hover:text-white hover:bg-white/5 bg-gradient-to-r from-purple-500/10 to-transparent"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-indigo-400"
                        : item.highlight
                        ? "text-purple-400 group-hover:text-purple-300"
                        : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {item.badge}
                  </span>
                )}
                {item.href === "/discover" && shortlistedCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white">
                    {shortlistedCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick explainability trigger */}
          <button
            onClick={() => setIsExplainModalOpen(true)}
            className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-dashed border-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              How Matching Works
            </span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </button>
        </nav>

        {/* Current Active Persona Widget */}
        <div className="p-3 border-t border-white/10 bg-[#0c1220]">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Active Identity
              </span>
              <button
                onClick={() => setIsPersonaModalOpen(true)}
                className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Switch
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-white/10">
                {currentStudent.avatarUrl ? (
                  <Image
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-white">
                    {currentStudent.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentStudent.fullName}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentStudent.college}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <PersonaSwitcherModal
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
      />
      <ExplainabilityModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
      />
    </>
  );
}
