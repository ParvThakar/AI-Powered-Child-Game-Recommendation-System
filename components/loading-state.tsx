import React from "react";
import { Loader2, ShieldCheck, Sparkles, Search } from "lucide-react";

export function LoadingState() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Finding Suitable Games
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Searching regional store listings, enforcing hard content safety checks, and synthesizing verified AI recommendations.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="w-full space-y-3 pt-2 text-left text-xs">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Search className="w-4 h-4 text-indigo-500 shrink-0" />
            <span>1. Querying regional official store catalog...</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>2. Enforcing age suitability & content rating hard filters...</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>3. Ranking candidates & preparing grounded AI explanations...</span>
          </div>
        </div>

        {/* Skeleton Card Preview */}
        <div className="w-full mt-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 animate-pulse space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
            </div>
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
