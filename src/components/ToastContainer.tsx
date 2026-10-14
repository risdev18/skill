"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = "border-slate-800 bg-[#0F1626]/95 text-slate-100";
        let Icon = Info;
        let iconColor = "text-indigo-400";

        if (toast.variant === "success") {
          borderClass = "border-emerald-500/30 bg-[#0c1a17]/95 text-slate-100";
          Icon = CheckCircle2;
          iconColor = "text-emerald-400";
        } else if (toast.variant === "error") {
          borderClass = "border-rose-500/30 bg-[#1e0e13]/95 text-slate-100";
          Icon = AlertCircle;
          iconColor = "text-rose-400";
        } else if (toast.variant === "info") {
          borderClass = "border-blue-500/30 bg-[#0b172a]/95 text-slate-100";
          Icon = Info;
          iconColor = "text-blue-400";
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-500 hover:text-slate-300 transition-colors shrink-0"
              aria-label="Close toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
