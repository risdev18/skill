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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Skill Matching Algorithm Architecture
              </h3>
              <p className="text-xs text-slate-500">
                100% Deterministic, Explainable & Unbiased Scoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6 text-sm text-slate-600">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              1. Mathematical Foundation
            </h4>
            <p className="mt-1 text-slate-500 text-xs leading-relaxed">
              Every project defines required skills with individual importance weights and minimum required proficiency levels (1 = Beginner, 2 = Intermediate, 3 = Advanced).
            </p>
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
              <div className="text-slate-400">// Normalized Skill Weights</div>
              <div className="text-slate-600">normalizedWeight = (rawWeight / sumOfAllWeights) * 100</div>
              <div className="mt-2 text-slate-400">// Proficiency Ratio (capped at 1.0)</div>
              <div className="text-slate-600">proficiencyRatio = min(studentProficiency / minimumRequiredProficiency, 1.0)</div>
              <div className="mt-2 text-slate-400">// Skill Contribution</div>
              <div className="text-slate-600">skillContribution = normalizedWeight * proficiencyRatio</div>
              <div className="mt-2 text-slate-400">// Base Skill Score (0 to 100)</div>
              <div className="text-emerald-700 font-bold">baseSkillScore = sum(all skillContributions)</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              2. Transparent Bounded Adjustments (Max ±10 Pts)
            </h4>
            <p className="mt-1 text-slate-500 text-xs leading-relaxed">
              To account for project feasibility without distorting technical competency, small bounded modifiers are computed separately:
            </p>
            <ul className="mt-2 space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-900">Availability Bonus (+0 to +4 pts):</strong> Candidates offering 15+ hrs/week receive +4 points; 10-15 hrs/week receive +2.5 points.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-900">Domain Interest (+0 to +3 pts):</strong> If the candidate listed the project's category as an explicit interest.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-slate-900">Experience Alignment (+0 to +3 pts):</strong> Evaluates academic standing alignment with project expectations.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              3. Honest Engineering Guarantees
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-900">No Hallucinations</div>
                <div className="text-slate-500 mt-1">
                  If a skill or field is missing, it is evaluated as 0 contribution. No skills are assumed or fabricated.
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-semibold text-slate-900">Equivalence Normalization</div>
                <div className="text-slate-500 mt-1">
                  Skills like &apos;React.js&apos;, &apos;react&apos;, and &apos;REACT&apos; are normalized so spelling variations never penalize students.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
