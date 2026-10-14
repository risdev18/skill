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
  ChevronRight,
  Menu,
  X,
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
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-md"
          aria-label="Toggle navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 group"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                SkillSync
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                Engineering Team Matcher
              </p>
            </div>
          </Link>
        </div>

        {/* Storage Mode Status Pill */}
        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
          <Link
            href="/settings"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 transition-colors group shadow-2xs"
          >
            <div className="flex items-center gap-2 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? "bg-amber-500" : "bg-emerald-500"}`} />
              <span className="text-slate-700 font-semibold">
                {isDemoMode ? "Demo Mode (Local)" : "Supabase Live"}
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-x-0.5" />
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
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                    : item.highlight
                    ? "text-slate-700 hover:text-slate-900 hover:bg-purple-50/60 bg-purple-50/30"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-indigo-600"
                        : item.highlight
                        ? "text-purple-600 group-hover:text-purple-700"
                        : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                    {item.badge}
                  </span>
                )}
                {item.href === "/discover" && shortlistedCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                    {shortlistedCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick explainability trigger */}
          <button
            onClick={() => setIsExplainModalOpen(true)}
            className="w-full mt-3 flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/60 border border-dashed border-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              How Matching Works
            </span>
            <ChevronRight className="w-3 h-3 opacity-60 text-slate-400" />
          </button>
        </nav>

        {/* Current Active Persona Widget */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                Active Identity
              </span>
              <button
                onClick={() => setIsPersonaModalOpen(true)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Switch
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200">
                {currentStudent.avatarUrl ? (
                  <Image
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-700">
                    {currentStudent.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentStudent.fullName}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
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
