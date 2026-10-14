"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Project } from "@/types";
import { X, Send, Sparkles, AlertCircle } from "lucide-react";

interface ApplicationModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  calculatedMatchScore?: number;
}

export function ApplicationModal({
  project,
  isOpen,
  onClose,
  calculatedMatchScore,
}: ApplicationModalProps) {
  const { applyToProject, currentStudent } = useApp();
  const [pitch, setPitch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) {
      setError("Please write a short pitch introducing your relevant skills.");
      return;
    }
    setError(null);
    setIsSubmitting(true);

    const success = applyToProject(project.id, pitch, calculatedMatchScore);
    setIsSubmitting(false);
    if (success) {
      setPitch("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Apply to Join Team
            </h3>
            <p className="text-xs text-indigo-400 font-medium truncate mt-0.5">
              {project.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {calculatedMatchScore !== undefined && (
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Your Skill Compatibility:</span>
              </div>
              <span className="text-sm font-bold text-white">
                {Math.round(calculatedMatchScore)}% Match
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Applying As
            </label>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">{currentStudent.fullName}</div>
                <div className="text-xs text-slate-400">{currentStudent.college} • {currentStudent.academicYear}</div>
              </div>
              <div className="text-xs text-indigo-400 font-medium">{currentStudent.availability}</div>
            </div>
          </div>

          <div>
            <label htmlFor="pitch" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Why are you a good fit? (Pitch)
            </label>
            <textarea
              id="pitch"
              rows={4}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Highlight your relevant experience, technical skills, and what component you'd like to work on..."
              className="w-full px-3.5 py-2.5 bg-[#090D16] border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
