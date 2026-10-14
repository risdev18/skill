"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, AlertCircle, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const router = useRouter();
  const { isDemoMode, students, switchPersona, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoSignIn = (studentId: string) => {
    switchPersona(studentId);
    showToast("Signed In (Demo Persona)", "Welcome to SkillSync Demo Mode", "info");
    router.push("/dashboard");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      // In demo mode, we transparently find a matching demo account or notify the user
      const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (found) {
        switchPersona(found.id);
        router.push("/dashboard");
      } else {
        // Fallback demo user
        switchPersona(students[0].id);
        showToast("Demo Mode Notice", "Logged in with standard demo persona.", "info");
        router.push("/dashboard");
      }
    } else {
      setError("Supabase live authentication requires connected credentials in environment variables.");
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">SkillSync</span>
          </Link>
          <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to find your teammates and manage capstone projects</p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
              <Info className="w-4 h-4" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              No real credentials required. You can instantly jump into the application using one of the pre-loaded student engineering personas below:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-alex")}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-left transition-colors"
              >
                <div className="font-semibold text-white truncate text-[11px]">Alex Chen</div>
                <div className="text-[10px] text-indigo-400">Full-Stack Lead</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-priya")}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-left transition-colors"
              >
                <div className="font-semibold text-white truncate text-[11px]">Priya Sharma</div>
                <div className="text-[10px] text-purple-400">AI / ML Specialist</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-marcus")}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-left transition-colors"
              >
                <div className="font-semibold text-white truncate text-[11px]">Marcus Rodriguez</div>
                <div className="text-[10px] text-cyan-400">Robotics & IoT</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-sarah")}
                className="p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-left transition-colors"
              >
                <div className="font-semibold text-white truncate text-[11px]">Sarah Jenkins</div>
                <div className="text-[10px] text-emerald-400">Cybersecurity Lead</div>
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F1626] border border-white/10 shadow-2xl">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{isDemoMode ? "Continue to Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-slate-400">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
              Create profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
