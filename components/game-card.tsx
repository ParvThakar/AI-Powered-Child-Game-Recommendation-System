import React from "react";
import { RecommendedGame } from "@/lib/schemas";
import { SafetyStatus } from "./safety-status";
import {
  Star,
  ExternalLink,
  Bot,
  Award,
  AlertCircle,
  Database,
  Coins,
  Megaphone,
  Smartphone,
} from "lucide-react";
import AppleIcon from "@/components/ui/apple-icon";
import HoloCard from "@/components/ui/HoloCard";
import SpotlightCard from "@/components/ui/SpotlightCard";

interface GameCardProps {
  game: RecommendedGame;
  isPrimary?: boolean;
  rankIndex?: number;
}

export function GameCard({ game, isPrimary = false, rankIndex }: GameCardProps) {
  const formattedRatingCount =
    game.ratingCount !== undefined
      ? game.ratingCount >= 1000000
        ? `${(game.ratingCount / 1000000).toFixed(1)}M`
        : game.ratingCount >= 1000
        ? `${(game.ratingCount / 1000).toFixed(1)}K`
        : game.ratingCount.toLocaleString()
      : null;

  const appleUrl = game.appleAppStoreUrl || game.storeUrl;
  const googleUrl =
    game.googlePlayUrl ||
    `https://play.google.com/store/search?q=${encodeURIComponent(game.title)}&c=apps`;

  if (isPrimary) {
    return (
      <HoloCard tiltMax={8} className="rounded-3xl shadow-xl">
        <SpotlightCard
          spotlightColor="#6366f1"
          intensity={0.25}
          spotlightSize={320}
          className="relative overflow-hidden rounded-3xl apple-glass-card p-6 sm:p-8 transition-all duration-300 !bg-transparent"
        >
          {/* Glow Accent Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500" />

        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/90 rounded-full dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              #1 Top Recommendation
            </span>
            {game.isDemoData && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                <Database className="w-3 h-3" />
                Demo data
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
              <Smartphone className="w-3 h-3" />
              App Store & Google Play
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SafetyStatus
              status={game.suitabilityStatus}
              contentRating={game.contentRating}
              minimumAge={game.minimumAge}
              size="sm"
            />
          </div>
        </div>

        {/* Game Title & Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {game.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.iconUrl}
              alt={game.title}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-lg border border-slate-200 dark:border-slate-800 shrink-0 transform transition-transform hover:scale-105 duration-200"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
              {game.title.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              {game.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-600 dark:text-slate-300">
              {game.rating !== undefined && (
                <div className="flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{game.rating.toFixed(1)}</span>
                  {formattedRatingCount && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                      ({formattedRatingCount} reviews)
                    </span>
                  )}
                </div>
              )}

              {game.category && (
                <span className="px-2.5 py-0.5 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {game.category}
                </span>
              )}

              {game.score && (
                <span className="text-xs text-indigo-500 dark:text-indigo-400 font-mono font-semibold">
                  Match Score: {game.score}/100
                </span>
              )}
            </div>

            {game.description && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {game.description}
              </p>
            )}
          </div>
        </div>

        {/* AI Explanation / Reasoning Box */}
        <div className="mt-6 rounded-xl bg-indigo-50/80 p-4 sm:p-5 border border-indigo-100 dark:bg-slate-800/60 dark:border-slate-700/80">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                AI Match Analysis & Recommendation:
              </h4>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {game.reason}
              </p>
            </div>
          </div>
        </div>

        {/* Caveats & Notices */}
        {game.caveats && game.caveats.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Parental & Gameplay Notes</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {game.caveats.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800"
                >
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Links & Attributes Footer */}
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            {game.hasInAppPurchases !== undefined && (
              <span className="flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {game.hasInAppPurchases ? "In-app purchases" : "No in-app purchases"}
              </span>
            )}
            {game.containsAds !== undefined && (
              <span className="flex items-center gap-1">
                <Megaphone className="w-3.5 h-3.5" />
                {game.containsAds ? "Contains ads" : "No ads"}
              </span>
            )}
            <span className="text-[11px] text-slate-400">
              Verified: {game.metadataSource}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {appleUrl && (
              <a
                href={appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-black text-white font-medium text-xs transition-all active:scale-95 shadow-sm border border-slate-700/50 backdrop-blur-md"
              >
                <AppleIcon className="w-3.5 h-3.5" />
                <span>App Store</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}
            {googleUrl && (
              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-transform active:scale-95 shadow-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Google Play</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            )}
          </div>
        </div>
        </SpotlightCard>
      </HoloCard>
    );
  }

  // Grid Card (Alternatives & Up to 20 Recommendations)
  return (
    <HoloCard tiltMax={10} className="rounded-2xl h-full">
      <SpotlightCard
        spotlightColor="#a855f7"
        intensity={0.2}
        spotlightSize={260}
        className="group relative rounded-2xl apple-glass-card p-5 h-full transition-all duration-300 flex flex-col justify-between !bg-transparent"
      >
        <div>
        {/* Top Badges & Rank */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {rankIndex && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md font-mono ${
                  rankIndex === 2
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : rankIndex === 3
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : rankIndex <= 5
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-700/50"
                }`}
              >
                #{rankIndex}
              </span>
            )}
            <SafetyStatus
              status={game.suitabilityStatus}
              contentRating={game.contentRating}
              minimumAge={game.minimumAge}
              size="sm"
            />
          </div>

          {game.isDemoData && (
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800">
              Demo data
            </span>
          )}
        </div>

        {/* Icon & Details */}
        <div className="flex items-start gap-3.5">
          {game.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.iconUrl}
              alt={game.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
              {game.title.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {game.title}
            </h4>

            <div className="flex items-center gap-2 mt-1">
              {game.rating !== undefined && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{game.rating.toFixed(1)}</span>
                  {formattedRatingCount && (
                    <span className="text-[11px] text-slate-400 font-normal">
                      ({formattedRatingCount})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {game.description && (
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        )}
      </div>

      {/* Store Buttons Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]">
          {game.category}
        </span>

        <div className="flex items-center gap-2">
          {appleUrl && (
            <a
              href={appleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 p-1 transition-colors"
              title="View on Apple App Store"
            >
              <AppleIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {googleUrl && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 p-1 transition-colors"
              title="View on Google Play Store"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={game.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pl-1"
          >
            <span>Listing</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          </div>
        </div>
      </SpotlightCard>
    </HoloCard>
  );
}
