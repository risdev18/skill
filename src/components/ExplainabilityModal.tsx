"use client";

import React from "react";
import { X, Cpu, CheckCircle, Scale, ShieldCheck, HelpCircle } from "lucide-react";

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExplainabilityModal({ isOpen, onClose }: ExplainabilityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Skill Matching Algorithm Architecture
              </h3>
              <p className="text-xs text-slate-400">
                100% Deterministic, Explainable & Unbiased Scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-300">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              1. Mathematical Foundation
            </h4>
            <p className="mt-1 text-slate-400 text-xs leading-relaxed">
              Every project defines required skills with individual importance weights and minimum required proficiency levels (1 = Beginner, 2 = Intermediate, 3 = Advanced).
            </p>
            <div className="mt-3 p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-xs text-indigo-300 space-y-1">
              <div>// Normalized Skill Weights</div>
              <div className="text-slate-400">normalizedWeight = (rawWeight / sumOfAllWeights) * 100</div>
              <div className="mt-2">// Proficiency Ratio (capped at 1.0)</div>
              <div className="text-slate-400">proficiencyRatio = min(studentProficiency / minimumRequiredProficiency, 1.0)</div>
              <div className="mt-2">// Skill Contribution</div>
              <div className="text-slate-400">skillContribution = normalizedWeight * proficiencyRatio</div>
              <div className="mt-2">// Base Skill Score (0 to 100)</div>
              <div className="text-emerald-300">baseSkillScore = sum(all skillContributions)</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              2. Transparent Bounded Adjustments (Max ±10 Pts)
            </h4>
            <p className="mt-1 text-slate-400 text-xs leading-relaxed">
              To account for project feasibility without distorting technical competency, small bounded modifiers are computed separately:
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-white">Availability Bonus (+0 to +4 pts):</strong> Candidates offering 15+ hrs/week receive +4 points; 10-15 hrs/week receive +2.5 points.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-white">Domain Interest (+0 to +3 pts):</strong> If the candidate listed the project's category as an explicit interest.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-white">Experience Alignment (+0 to +3 pts):</strong> Evaluates academic standing alignment with project expectations.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              3. Honest Engineering Guarantees
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-semibold text-white">No Hallucinations</div>
                <div className="text-slate-400 mt-1">
                  If a skill or field is missing, it is evaluated as 0 contribution. No skills are assumed or fabricated.
                </div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="font-semibold text-white">Equivalence Normalization</div>
                <div className="text-slate-400 mt-1">
                  Skills like &apos;React.js&apos;, &apos;react&apos;, and &apos;REACT&apos; are normalized so spelling variations never penalize students.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
