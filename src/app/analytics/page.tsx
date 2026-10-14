"use client";

import React, { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { normalizeSkillName } from "@/lib/matching";
import { analyzeTeamSkillGaps } from "@/lib/gap-analyzer";

export default function AnalyticsPage() {
  const { students, projects, teams, applications } = useApp();

  // 1. Calculate Skill Supply vs Demand
  const skillSupplyDemand = useMemo(() => {
    const supplyMap: Record<string, number> = {};
    const demandMap: Record<string, number> = {};

    students.forEach((student) => {
      student.skills.forEach((sk) => {
        const name = sk.skillName;
        supplyMap[name] = (supplyMap[name] || 0) + 1;
      });
    });

    projects.forEach((proj) => {
      proj.requiredSkills.forEach((req) => {
        const name = req.skillName;
        demandMap[name] = (demandMap[name] || 0) + 1;
      });
    });

    // Top skills mentioned in either
    const allSkills = Array.from(
      new Set([...Object.keys(demandMap), ...Object.keys(supplyMap)])
    );

    return allSkills
      .map((skill) => ({
        skill,
        Demand: demandMap[skill] || 0,
        Supply: supplyMap[skill] || 0,
      }))
      .sort((a, b) => b.Demand + b.Supply - (a.Demand + a.Supply))
      .slice(0, 7);
  }, [students, projects]);

  // 2. Project Categories Distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [projects]);

  // 3. Team Skill Coverage Tiers
  const coverageTiers = useMemo(() => {
    let high = 0;
    let moderate = 0;
    let low = 0;

    teams.forEach((team) => {
      const proj = projects.find((p) => p.id === team.projectId);
      if (proj) {
        const rep = analyzeTeamSkillGaps(proj.id, proj.title, proj.requiredSkills, team.members);
        if (rep.coveragePercentage >= 80) high++;
        else if (rep.coveragePercentage >= 50) moderate++;
        else low++;
      }
    });

    return [
      { name: "Full Coverage (≥80%)", value: high, color: "#10B981" },
      { name: "Moderate Gaps (50-79%)", value: moderate, color: "#F59E0B" },
      { name: "Critical Gaps (<50%)", value: low, color: "#F43F5E" },
    ];
  }, [teams, projects]);

  // 4. Academic Year Distribution
  const academicYearsData = useMemo(() => {
    const yearCounts: Record<string, number> = {
      "1st Year": 0,
      "2nd Year": 0,
      "3rd Year": 0,
      "4th Year": 0,
      "Graduate": 0,
    };
    students.forEach((s) => {
      if (yearCounts[s.academicYear] !== undefined) {
        yearCounts[s.academicYear]++;
      }
    });

    return Object.entries(yearCounts).map(([year, count]) => ({
      year,
      Students: count,
    }));
  }, [students]);

  const COLORS = ["#6366F1", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B", "#EC4899", "#3B82F6"];

  return (
    <AppShell>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-4 border-b border-slate-200">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Platform Intelligence & Skill Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Skill & Collaboration Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Live metrics calculated directly from active student profiles, project requirements, and team coverage matrices.
          </p>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold">Active Students</span>
            <div className="text-2xl font-bold text-slate-900 mt-2">{students.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {students.reduce((acc, s) => acc + s.skills.length, 0)} total skills cataloged
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold">Projects Open</span>
            <div className="text-2xl font-bold text-indigo-700 mt-2">{projects.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Across 6 tech domains</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold">Formed Teams</span>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{teams.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active collaboration spaces</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold">Application Rate</span>
            <div className="text-2xl font-bold text-purple-700 mt-2">{applications.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">
              {Math.round((applications.filter((a) => a.status === "Accepted").length / (applications.length || 1)) * 100)}% acceptance rate
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Skill Supply vs Demand */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                Technical Skill Supply vs Demand
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Compares how many projects require a skill (Demand) vs declared student competencies (Supply)
              </p>
            </div>

            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillSupplyDemand} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="skill" tick={{ fill: "#64748B", fontSize: 11 }} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="Demand" fill="#6366F1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Supply" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Project Categories Distribution */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-600" />
                Project Categories Breakdown
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Proportion of capstone initiatives by engineering discipline
              </p>
            </div>

            <div className="h-72 mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Academic Seniority */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                Student Academic Standing Distribution
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Undergraduate vs graduate student distribution in the network
              </p>
            </div>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicYearsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="year" tick={{ fill: "#64748B", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748B", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      color: "#0F172A",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.08)",
                    }}
                  />
                  <Bar dataKey="Students" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Team Skill Coverage Tiers */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Team Skill Coverage Health
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Percentage of project teams with adequate vs partial vs missing skill coverage
              </p>
            </div>

            <div className="space-y-4 mt-6">
              {coverageTiers.map((tier) => (
                <div key={tier.name} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{tier.name}</span>
                    <span style={{ color: tier.color }} className="font-bold">{tier.value} Teams</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        backgroundColor: tier.color,
                        width: `${teams.length > 0 ? (tier.value / teams.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
