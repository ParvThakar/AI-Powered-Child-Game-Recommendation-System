"use client";

import React, { useState, useEffect } from "react";
import {
  SupportedCategory,
  CATEGORY_DETAILS,
  RecommendationRequest,
  StorePlatform,
} from "@/lib/schemas";
import { COUNTRY_NAMES } from "@/lib/geolocation";
import {
  GraduationCap,
  Puzzle,
  Palette,
  Compass,
  Trophy,
  Flame,
  Boxes,
  MapPin,
  Search,
  CheckCircle2,
  Smartphone,
  Globe2,
} from "lucide-react";
import AppleIcon from "@/components/ui/apple-icon";

const ICON_MAP = {
  GraduationCap,
  Puzzle,
  Palette,
  Compass,
  Trophy,
  Flame,
  Boxes,
};

const CATEGORY_STYLES: Record<
  SupportedCategory,
  {
    border: string;
    bg: string;
    text: string;
    iconBg: string;
    glow: string;
  }
> = {
  educational: {
    border: "border-emerald-500",
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30",
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-2 ring-emerald-500/30",
  },
  puzzle: {
    border: "border-cyan-500",
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
    iconBg: "bg-cyan-500 text-white shadow-md shadow-cyan-500/30",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-2 ring-cyan-500/30",
  },
  creativity: {
    border: "border-fuchsia-500",
    bg: "bg-fuchsia-500/15",
    text: "text-fuchsia-400",
    iconBg: "bg-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30",
    glow: "shadow-[0_0_15px_rgba(217,70,239,0.25)] ring-2 ring-fuchsia-500/30",
  },
  adventure: {
    border: "border-amber-500",
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-amber-500/30",
  },
  sports: {
    border: "border-sky-500",
    bg: "bg-sky-500/15",
    text: "text-sky-400",
    iconBg: "bg-sky-500 text-white shadow-md shadow-sky-500/30",
    glow: "shadow-[0_0_15px_rgba(14,165,233,0.25)] ring-2 ring-sky-500/30",
  },
  action: {
    border: "border-rose-500",
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    iconBg: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-2 ring-rose-500/30",
  },
  strategy: {
    border: "border-violet-500",
    bg: "bg-violet-500/15",
    text: "text-violet-400",
    iconBg: "bg-violet-500 text-white shadow-md shadow-violet-500/30",
    glow: "shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-2 ring-violet-500/30",
  },
};

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  IN: "🇮🇳",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
  DE: "🇩🇪",
  FR: "🇫🇷",
  JP: "🇯🇵",
  BR: "🇧🇷",
  MX: "🇲🇽",
  SG: "🇸🇬",
  NZ: "🇳🇿",
  IT: "🇮🇹",
  ES: "🇪🇸",
  NL: "🇳🇱",
  SE: "🇸🇪",
  NO: "🇳🇴",
  DK: "🇩🇰",
  FI: "🇫🇮",
  IE: "🇮🇪",
  CH: "🇨🇭",
  AT: "🇦🇹",
  PL: "🇵🇱",
  ZA: "🇿🇦",
  AE: "🇦🇪",
  KR: "🇰🇷",
  ID: "🇮🇩",
  MY: "🇲🇾",
  PH: "🇵🇭",
  TH: "🇹🇭",
  VN: "🇻🇳",
};

interface RecommendationFormProps {
  onSubmit: (params: RecommendationRequest) => void;
  isLoading: boolean;
}

export function RecommendationForm({
  onSubmit,
  isLoading,
}: RecommendationFormProps) {
  const [age, setAge] = useState<number>(8);
  const [category, setCategory] = useState<SupportedCategory>("educational");
  const [countryCode, setCountryCode] = useState<string>("US");
  const [countryName, setCountryName] = useState<string>("United States");
  const [platform, setPlatform] = useState<StorePlatform>("all");
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(true);
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Detect IP country on initial load
  useEffect(() => {
    let mounted = true;
    async function loadLocation() {
      try {
        const res = await fetch("/api/location");
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.countryCode) {
            setCountryCode(data.countryCode);
            setCountryName(
              data.countryName || COUNTRY_NAMES[data.countryCode] || data.countryCode
            );
            if (data.source === "ip") {
              setGeoNotice(`Detected from your IP (${data.countryCode}). You can change this below.`);
            }
          }
        }
      } catch (err) {
        console.warn("Location detection failed:", err);
      } finally {
        if (mounted) setIsDetectingLocation(false);
      }
    }
    loadLocation();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCountryChange = (code: string) => {
    setCountryCode(code);
    setCountryName(COUNTRY_NAMES[code] || code);
    setGeoNotice(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age,
      category,
      countryCode,
      platform,
      limit: 20,
    });
  };

  const getAgeLabel = (a: number) => {
    if (a <= 3) return "Toddler / Early Years (1–3)";
    if (a <= 8) return "Young Child (4–8)";
    if (a <= 12) return "Pre-Teen / Tween (9–12)";
    if (a <= 17) return "Teen (13–17)";
    return "Young Adult & Adult (18–30)";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-3xl apple-glass-card p-6 sm:p-8 md:p-10 space-y-8 transition-all"
    >
      {/* 1. Age Selection with Slider and Group Pills */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Target Age:{" "}
              <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl ml-1">
                {age} {age === 1 ? "year old" : "years old"}
              </span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Category: <span className="font-semibold text-slate-700 dark:text-slate-300">{getAgeLabel(age)}</span>
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Ages 1 to 30 supported</span>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min={1}
            max={30}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
            className="w-full h-3 bg-slate-200 dark:bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono px-1">
            <span>1 yr</span>
            <span>7 yrs</span>
            <span>13 yrs</span>
            <span>18 yrs</span>
            <span>25 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Quick Age Group Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: "2 yrs (Toddler)", val: 2 },
            { label: "5 yrs (Child)", val: 5 },
            { label: "8 yrs (Kids)", val: 8 },
            { label: "11 yrs (Tween)", val: 11 },
            { label: "15 yrs (Teen)", val: 15 },
            { label: "21 yrs (Adult)", val: 21 },
          ].map((quick) => (
            <button
              key={quick.val}
              type="button"
              onClick={() => setAge(quick.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                age === quick.val
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-[1.02]"
              }`}
            >
              {quick.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Platform Selector (App Store / Google Play / Both) */}
      <div className="space-y-3">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Store Platform
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              id: "all",
              label: "All Stores",
              icon: Globe2,
              desc: "Google Play & App Store",
              activeClass: "border-indigo-500 bg-indigo-500/15 text-indigo-300 ring-2 ring-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.25)]",
              iconClass: "text-indigo-400",
            },
            {
              id: "apple",
              label: "Apple App Store",
              icon: AppleIcon,
              desc: "iOS / iPadOS verified",
              activeClass: "border-cyan-400 bg-cyan-500/15 text-cyan-300 ring-2 ring-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
              iconClass: "text-cyan-400",
            },
            {
              id: "google",
              label: "Google Play Store",
              icon: Smartphone,
              desc: "Android verified",
              activeClass: "border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-2 ring-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]",
              iconClass: "text-emerald-400",
            },
          ].map((p) => {
            const Icon = p.icon;
            const isSelected = platform === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id as StorePlatform)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? p.activeClass
                    : "border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Icon className={`w-4 h-4 ${isSelected ? p.iconClass : "text-slate-500"}`} />
                  {isSelected && <CheckCircle2 className={`w-3.5 h-3.5 ${p.iconClass}`} />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{p.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Category Selection with Distinct Theme Colors */}
      <div className="space-y-3">
        <label className="block text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Game Category
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
          {CATEGORY_DETAILS.map((cat) => {
            const Icon = ICON_MAP[cat.icon as keyof typeof ICON_MAP] || Compass;
            const isSelected = category === cat.id;
            const theme = CATEGORY_STYLES[cat.id];

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`relative flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? `${theme.border} ${theme.bg} ${theme.glow} scale-[1.02]`
                    : "border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.01]"
                }`}
              >
                <div
                  className={`p-2 rounded-xl mb-2 transition-colors ${
                    isSelected
                      ? theme.iconBg
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <span className={`font-bold text-xs ${isSelected ? theme.text : "text-slate-900 dark:text-white"}`}>
                  {cat.name}
                </span>

                {isSelected && (
                  <CheckCircle2 className={`w-3.5 h-3.5 ${theme.text} absolute top-3 right-3`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Region Scroll Selector with Search Filter */}
      <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Catalog Region:
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold font-mono">
              <span>{COUNTRY_FLAGS[countryCode] || "🌐"}</span>
              <span>{countryName}</span>
              <span className="text-[10px] text-cyan-400/80">({countryCode})</span>
            </span>
            {isDetectingLocation && (
              <span className="text-[11px] text-slate-400 animate-pulse">(detecting...)</span>
            )}
          </div>

          {/* Region Quick Search Filter */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search / filter regions..."
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/80 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>

        {geoNotice && (
          <p className="text-[11px] text-slate-400">{geoNotice}</p>
        )}

        {/* Scrollable Region Pill Track */}
        <div className="relative">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x focus:outline-none no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {Object.entries(COUNTRY_NAMES)
              .filter(
                ([code, name]) =>
                  name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                  code.toLowerCase().includes(countrySearch.toLowerCase())
              )
              .map(([code, name]) => {
                const isSelected = countryCode === code;
                const flag = COUNTRY_FLAGS[code] || "🌐";
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleCountryChange(code)}
                    className={`snap-start shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-2 ring-cyan-400/40 scale-105"
                        : "border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-cyan-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:scale-[1.02]"
                    }`}
                  >
                    <span className="text-sm leading-none">{flag}</span>
                    <span className="whitespace-nowrap">{name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                        isSelected
                          ? "bg-cyan-400 text-slate-950 font-bold"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      {code}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full group relative flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-fuchsia-600 hover:from-cyan-400 hover:via-indigo-500 hover:to-fuchsia-500 active:scale-[0.99] text-white font-bold text-base transition-all duration-200 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          <span>
            {isLoading
              ? "Scanning Stores & Evaluating Age Suitability..."
              : "Discover Up to 20 Verified Games"}
          </span>
        </button>
      </div>
    </form>
  );
}
