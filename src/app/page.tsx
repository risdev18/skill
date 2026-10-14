"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Cpu,
  Users,
  ShieldAlert,
  FolderGit2,
  CheckCircle2,
  CheckSquare,
  Search,
  Layers,
  ChevronRight,
  BarChart2,
  Code2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090D16]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              SkillSync
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <Link href="/projects" className="hover:text-white transition-colors">Explore Projects</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden border-b border-white/5">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Deterministic Skill Matching & Gap Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Your Next Great Project Starts With the{" "}
            <span className="gradient-brand-text">Right Team.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Discover talented students, find complementary skills, and build balanced teams for your next college project or hackathon.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/matching"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Find My Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/projects"
              className="w-full sm:w-auto px-7 py-3.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl text-sm font-semibold border border-white/10 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Explore Projects</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Interactive Application Dashboard Preview */}
          <div className="mt-14 relative rounded-2xl border border-white/10 bg-[#0F1626]/90 shadow-2xl p-4 sm:p-6 text-left overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-500">skillsync.internal/matching</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Active Project: MediScan AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                <div className="text-xs text-slate-400 font-medium">Target Role</div>
                <div className="text-sm font-bold text-white mt-1">Full-Stack & Deep Learning</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">Python (30%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-medium">PyTorch (30%)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-medium">React (25%)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/5 md:col-span-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Top Match Candidate</span>
                    <span className="text-xs font-bold text-emerald-400">92% Compatibility</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Alex Chen • Computer Science, 3rd Year
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">
                    &quot;Strong match: Candidate covers 88% of base requirements with advanced React, intermediate Python, and high weekly availability (15+ hrs/week).&quot;
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Normalized Weight Score: 88.5%</span>
                  <span className="text-indigo-400 font-medium">Availability Bonus: +4.0 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 border-b border-white/5 bg-[#0A0E1A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Engineered for Student Builders
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Every tool you need to discover peers with complementary skill sets, organize balanced teams, and drive engineering projects to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                1. Discover Talent
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Filter students by programming languages, frameworks, AI/ML libraries, academic year, and weekly hours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                2. Match Skills Intelligently
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Calculate transparent compatibility scores using weighted proficiency ratios with zero black-box mystery.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                3. Identify Team Skill Gaps
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Automatically diagnose missing competencies in existing rosters and generate tailored recruitment recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                4. Collaborate on Projects
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Publish capstone or hackathon ideas, review structured student pitches, and manage team roster sizes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                5. Track Your Progress
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Integrated project task boards with priority tagging, assignees, and sprint status from idea to deployment.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#0F1626] border border-white/10 hover:border-indigo-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mt-4 tracking-tight">
                Skill Supply & Demand Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Live interactive charts comparing high-demand capstone tech stacks with available student competencies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How SkillSync Works
            </h2>
            <p className="mt-3 text-sm text-slate-400">
              A streamlined five-step journey from project ideation to high-performing engineering teams.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Build your profile",
                desc: "Declare your verified technical proficiencies (Beginner, Intermediate, Advanced), GitHub repositories, and weekly availability.",
              },
              {
                step: "02",
                title: "Discover project opportunities",
                desc: "Browse capstones and research initiatives filtered by category, required tech stacks, and team capacity.",
              },
              {
                step: "03",
                title: "Match complementary skills",
                desc: "Execute the explainable matching algorithm to calculate compatibility percentages and view clear justification breakdowns.",
              },
              {
                step: "04",
                title: "Build your team",
                desc: "Inspect team skill coverage, review applicant pitches, and confirm members without exceeding roster constraints.",
              },
              {
                step: "05",
                title: "Start collaborating",
                desc: "Organize sprint deliverables on the project task board and track team momentum toward final submission.",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex items-start gap-5 p-5 rounded-xl bg-[#0F1626] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="text-lg font-black text-indigo-400 font-mono shrink-0 w-10">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Build Your Engineering Dream Team?
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Stop hoping for random hackathon pairings. Start matching based on real, complementary technical competencies today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <span>Launch Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#060910] py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">SkillSync</span>
            <span>— Engineering Capstone Platform</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/discover" className="hover:text-white transition-colors">Directory</Link>
            <Link href="/matching" className="hover:text-white transition-colors">Matching</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
