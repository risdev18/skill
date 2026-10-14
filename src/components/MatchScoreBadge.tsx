"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

interface MatchScoreBadgeProps {
  score: number;
  baseScore?: number;
  bonusScore?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function MatchScoreBadge({
  score,
  baseScore,
  bonusScore,
  showLabel = true,
}: MatchScoreBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  let colorClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
  let ringColor = "stroke-emerald-600";
  let label = "High Match";

  if (score >= 80) {
    colorClass = "text-emerald-700 bg-emerald-50 border-emerald-300";
    ringColor = "stroke-emerald-600";
    label = "Strong Match";
  } else if (score >= 60) {
    colorClass = "text-indigo-700 bg-indigo-50 border-indigo-300";
    ringColor = "stroke-indigo-600";
    label = "Solid Match";
  } else if (score >= 40) {
    colorClass = "text-amber-800 bg-amber-50 border-amber-300";
    ringColor = "stroke-amber-600";
    label = "Moderate Match";
  } else {
    colorClass = "text-rose-700 bg-rose-50 border-rose-300";
    ringColor = "stroke-rose-600";
    label = "Low Match";
  }

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-2 rounded-xl border px-2.5 py-1 transition-all ${colorClass}`}
      >
        <div className="relative w-7 h-7 flex items-center justify-center">
          <svg className="w-7 h-7 transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r={radius}
              className="stroke-slate-200"
              strokeWidth="3.5"
              fill="transparent"
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              className={`${ringColor} transition-all duration-700 ease-out`}
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute text-[10px] font-bold tracking-tighter">
            {Math.round(score)}%
          </span>
        </div>

        {showLabel && (
          <div className="text-left">
            <span className="text-xs font-bold block leading-tight">{score}% Match</span>
            <span className="text-[10px] opacity-80 block font-medium">{label}</span>
          </div>
        )}
      </div>

      {showTooltip && (baseScore !== undefined || bonusScore !== undefined) && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-[11px] text-slate-200 z-50 pointer-events-none animate-in fade-in zoom-in-95">
          <div className="font-semibold text-white flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Compatibility Score
          </div>
          <div className="mt-1.5 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Base Skill Coverage:</span>
              <span className="font-semibold text-white">{Math.round(baseScore ?? score)}%</span>
            </div>
            {bonusScore !== undefined && (
              <div className="flex justify-between">
                <span className="text-slate-400">Availability Bonus:</span>
                <span className={`font-semibold ${bonusScore >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {bonusScore >= 0 ? `+${bonusScore}` : bonusScore} pts
                </span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-slate-800 text-white font-bold">
              <span>Overall Match:</span>
              <span className="text-indigo-400">{Math.round(score)}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
