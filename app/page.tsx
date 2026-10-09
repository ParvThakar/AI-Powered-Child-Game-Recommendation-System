"use client";

import React, { useState } from "react";
import {
  RecommendationRequest,
  RecommendationResponse,
} from "@/lib/schemas";
import { RecommendationForm } from "@/components/recommendation-form";
import { GameCard } from "@/components/game-card";
import { LoadingState } from "@/components/loading-state";
import { AnimatedBackground } from "@/components/ui/animated-background";
import {
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
  Info,
  RefreshCcw,
  Gamepad2,
  Smartphone,
  Layers,
  Flame,
  Award,
  Star,
  Sparkles,
} from "lucide-react";
import GlitchText from "@/components/ui/GlitchText";
import ScrollFloat from "@/components/ui/ScrollFloat";
import GlowCursor from "@/components/ui/GlowCursor";
import AppleIcon from "@/components/ui/apple-icon";
import TechText from "@/components/ui/TechText";
import InfiniteSpiral from "@/components/ui/InfiniteSpiral";
import GlassSurface from "@/components/ui/GlassSurface";
import { GameCoverLoop, POPULAR_FEATURED_GAMES } from "@/components/ui/GameCoverLoop";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (params: RecommendationRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Server responded with ${res.status}`
        );
      }

      const data: RecommendationResponse = await res.json();
      setResult(data);

      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById("recommendation-results");
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      console.error("Search failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while fetching game recommendations."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* React Bits Subtle Ambient Particle Background */}
      <AnimatedBackground />

      {/* Interactive WebGL Glow Cursor overlay */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        <GlowCursor
          color="#6366F1"
          secondaryColor="#A855F7"
          trailLength={36}
          trailWidth={7}
          glowIntensity={1.8}
          glowSpread={1.3}
          opacity={0.85}
          pulseSpeed={0.9}
          blendMode="screen"
        />
      </div>

      {/* Top Gaming Navigation Header with GlassSurface */}
      <header className="relative z-30 sticky top-0 px-4 sm:px-6 py-3 flex justify-center transition-colors">
        <GlassSurface
          width="100%"
          height={68}
          borderRadius={24}
          borderWidth={0.08}
          blur={14}
          brightness={45}
          opacity={0.88}
          saturation={1.4}
          className="max-w-6xl w-full apple-glass shadow-lg"
        >
          <div className="w-full px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
                PlaySafe Gaming
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full apple-glass-subtle text-slate-700 dark:text-slate-300 font-medium border border-white/10 shadow-sm">
                <AppleIcon className="w-3.5 h-3.5" />
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dual Store</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 font-semibold backdrop-blur-md shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </GlassSurface>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full space-y-10">
        {/* Hero Section: Centered, Grand Scale, High Impact Alignment */}
        <div className="max-w-5xl mx-auto text-center space-y-6 py-4 sm:py-8">
          {/* Interactive TechText Animated Heading from React Bits */}
          <div className="w-full max-w-5xl mx-auto space-y-1">
            <div className="w-full h-24 sm:h-36 md:h-44">
              <TechText
                text="Discover the Perfect Games"
                fontSize={130}
                fontWeight={900}
                color="#FFFFFF"
                accentColor="#06B6D4"
                speed={1.2}
                draggable={true}
                selection={true}
                labels={true}
                className="w-full h-full"
              />
            </div>
            <div className="w-full h-10 sm:h-14 md:h-16">
              <TechText
                text="in PlaySafe Gaming"
                fontSize={48}
                fontWeight={700}
                color="#CBD5E1"
                accentColor="#D946EF"
                speed={1.2}
                draggable={true}
                selection={true}
                labels={true}
                className="w-full h-full"
              />
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            From early toddler development to competitive esports and indie classics. We enforce official content ratings, country availability, and verified ratings before AI provides grounded explanations.
          </p>

          {/* Distinct theme color pills across the hero */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <AppleIcon className="w-3.5 h-3.5 text-cyan-300" />
              <span>Apple App Store</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Play Store</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>ESRB, PEGI & IARC Safety</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Authentic 4.0+ Stars</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>AI Grounded Match</span>
            </span>
          </div>
        </div>

        {/* Interactive 3D Showcase & Infinite Loop Section */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 p-5 rounded-3xl apple-glass border border-white/10 shadow-xl">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Featured 3D Vault
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Popular Titles Across Ages 1 to 30
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                Interactive 3D preview of Minecraft, Roblox, Subway Surfers, and official dual-store classics.
              </p>
            </div>
            <div className="w-full md:w-80 h-44 rounded-2xl overflow-hidden relative bg-black/40 border border-white/5 shrink-0">
              <InfiniteSpiral
                items={POPULAR_FEATURED_GAMES.map((g) => ({
                  src: g.coverUrl,
                  alt: g.name,
                  label: `${g.name} (${g.age})`,
                  href: g.appleUrl,
                }))}
                speed={0.65}
                direction="up"
                animationMode="all"
                radius={90}
                cardWidth={70}
                cardHeight={70}
                verticalSpacing={30}
                perspective={800}
                cardsPerTurn={6}
                centerScale={1.2}
                edgeFade={0.2}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Seamless infinite two-row horizontal game-cover loop */}
          <GameCoverLoop />
        </div>

        {/* Input Form */}
        <RecommendationForm onSubmit={handleSearch} isLoading={isLoading} />

        {/* Dynamic States: Loading, Error, Results */}
        {isLoading && <LoadingState />}

        {error && (
          <div className="rounded-3xl border border-rose-200/80 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/50 backdrop-blur-xl p-6 text-rose-900 dark:text-rose-200 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 font-bold text-base">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>Could not complete game recommendations</span>
            </div>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-rose-200 hover:bg-rose-300 text-rose-900 dark:bg-rose-900 dark:text-rose-100 transition-colors cursor-pointer"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {result && (
          <div id="recommendation-results" className="space-y-8 animate-in fade-in duration-300">
            {/* Results Meta Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl apple-glass text-xs">
              <div className="flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Found {result.totalRecommended} Verified Games
                </span>
                <span className="text-slate-400">•</span>
                <span>Age: {result.age} yrs</span>
                <span className="text-slate-400">•</span>
                <span className="uppercase font-semibold">{result.category}</span>
                <span className="text-slate-400">•</span>
                <span>{result.countryName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {result.meta.aiAssisted ? "AI Match Grounded" : "Deterministic Ranking"}
                </span>
                {result.meta.aiEngine && (
                  <span className="text-slate-400 text-[11px] hidden md:inline">
                    {result.meta.aiEngine}
                  </span>
                )}
              </div>
            </div>

            {/* Empty State */}
            {!result.recommendation ? (
              <div className="rounded-3xl border border-amber-200 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/30 backdrop-blur-md p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">
                    No Eligible Games Found for This Criteria
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300 max-w-md mx-auto">
                    {result.disclaimer}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Spotlight Primary Recommendation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      Featured Top Pick for Age {result.age}
                    </h2>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      Ranked #1 of {result.totalRecommended}
                    </span>
                  </div>
                  <GameCard game={result.recommendation} isPrimary={true} />
                </div>

                {/* Grid of Verified Alternatives (Up to 19 more games) */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-500" />
                        Verified Recommendations #{2} to #{result.totalRecommended}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Exclusively Google Play & Apple App Store
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.alternatives.map((alt, idx) => (
                        <GameCard
                          key={alt.gameId}
                          game={alt}
                          isPrimary={false}
                          rankIndex={idx + 2}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Safety & Store Notice */}
                <div className="rounded-2xl apple-glass p-5 flex items-start gap-3.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                  <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">
                      Verified Store Catalog & Age Suitability Policy
                    </span>
                    <p className="leading-relaxed">
                      All titles are linked directly to their official Apple App Store and Google Play Store listings. Content ratings (ESRB, PEGI, Apple Advisory) are verified to match the target age. Always review in-app purchases and privacy terms before installation.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
