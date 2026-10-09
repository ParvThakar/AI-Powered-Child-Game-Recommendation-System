import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface SafetyStatusProps {
  status: "verified" | "unverified" | "restricted";
  contentRating?: string;
  minimumAge?: number;
  explanation?: string;
  size?: "sm" | "md" | "lg";
}

export function SafetyStatus({
  status,
  contentRating,
  minimumAge,
  explanation,
  size = "md",
}: SafetyStatusProps) {
  if (status === "verified") {
    if (explanation && size !== "sm") {
      return (
        <div className="inline-flex flex-col gap-1">
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            {explanation}
          </p>
        </div>
      );
    }
    return null;
  }

  if (status === "restricted") {
    return (
      <div className="inline-flex flex-col gap-1">
        <div
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 ${
            size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs"
          }`}
        >
          <ShieldAlert className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
          <span>Restricted Rating</span>
        </div>
        {explanation && size !== "sm" && (
          <p className="text-[11px] text-rose-700 dark:text-rose-400">
            {explanation}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 ${
          size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-xs"
        }`}
      >
        <AlertTriangle className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        <span>Not Verified</span>
      </div>
      {size !== "sm" && (
        <p className="text-[11px] text-amber-700 dark:text-amber-400">
          Missing verified store rating. Parental check required before install.
        </p>
      )}
    </div>
  );
}
