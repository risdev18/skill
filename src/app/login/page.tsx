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
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xs shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">SkillSync</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-xs text-slate-600 mt-1">Sign in to find your teammates and manage capstone projects</p>
        </div>

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold mb-1">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Demo Mode Active</span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              No real credentials required. You can instantly jump into the application using one of the pre-loaded student engineering personas below:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-alex")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
              >
                <div className="font-bold text-slate-900 truncate text-[11px]">Alex Chen</div>
                <div className="text-[10px] text-indigo-600 font-medium">Full-Stack Lead</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-priya")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
              >
                <div className="font-bold text-slate-900 truncate text-[11px]">Priya Sharma</div>
                <div className="text-[10px] text-purple-600 font-medium">AI / ML Specialist</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-marcus")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
              >
                <div className="font-bold text-slate-900 truncate text-[11px]">Marcus Rodriguez</div>
                <div className="text-[10px] text-cyan-600 font-medium">Robotics & IoT</div>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("student-sarah")}
                className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-colors shadow-xs"
              >
                <div className="font-bold text-slate-900 truncate text-[11px]">Sarah Jenkins</div>
                <div className="text-[10px] text-emerald-600 font-medium">Cybersecurity Lead</div>
              </button>
            </div>
          </div>
        )}

        {/* Credentials Form */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                University Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-medium"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{isDemoMode ? "Continue to Dashboard" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Create profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
