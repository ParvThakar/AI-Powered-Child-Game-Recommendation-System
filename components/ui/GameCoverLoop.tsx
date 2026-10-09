'use client';

import React from 'react';
import './GameCoverLoop.css';
import { AppleIcon } from './apple-icon';
import { Smartphone, Star, ShieldCheck } from 'lucide-react';

export interface GameCoverItem {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  coverUrl: string;
  age: string;
  category: string;
  appleUrl: string;
  googleUrl: string;
}

export const POPULAR_FEATURED_GAMES: GameCoverItem[] = [
  {
    id: 'minecraft',
    name: 'Minecraft',
    subtitle: 'Mojang Studios',
    rating: 4.8,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3b/b7/24/3bb724be-0244-933a-af48-ad2195689877/AppIcon-0-0-1x_U007emarketing-0-10-0-85-220.png/512x512bb.jpg',
    age: '9+ (E10+)',
    category: 'Adventure',
    appleUrl: 'https://apps.apple.com/app/minecraft/id479516143',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.mojang.minecraftpe'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    subtitle: 'Roblox Corporation',
    rating: 4.5,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/96/a9/a5/96a9a586-952f-c5b2-4898-085555d49d52/AppIcon-0-0-1x_U007epad-0-1-0-85-220.png/512x512bb.jpg',
    age: '12+ (Teen)',
    category: 'Sandbox',
    appleUrl: 'https://apps.apple.com/app/roblox/id431946152',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.roblox.client'
  },
  {
    id: 'subway-surfers',
    name: 'Subway Surfers',
    subtitle: 'SYBO Games',
    rating: 4.6,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/3b/6f/c0/3b6fc01e-ca3c-8335-fedb-35bc6c01ee18/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    age: '9+ (Everyone)',
    category: 'Endless Runner',
    appleUrl: 'https://apps.apple.com/app/subway-surfers/id512939461',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.kiloo.subwaysurf'
  },
  {
    id: 'stumble-guys',
    name: 'Stumble Guys',
    subtitle: 'Scopely',
    rating: 4.4,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/43/bf/f3/43bff3e4-2680-e0d4-371f-91023f1c1a42/AppIcon-0-0-1x_U007emarketing-0-5-0-85-220.png/512x512bb.jpg',
    age: '9+ (Everyone)',
    category: 'Party Royale',
    appleUrl: 'https://apps.apple.com/app/stumble-guys/id1541153364',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.kitkagames.fallbuddies'
  },
  {
    id: 'angry-birds-2',
    name: 'Angry Birds 2',
    subtitle: 'Rovio Entertainment',
    rating: 4.6,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/78/04/ca/7804ca49-20cd-e1f6-77e0-2b24b0dadcb8/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    age: '4+ (Everyone)',
    category: 'Physics Puzzle',
    appleUrl: 'https://apps.apple.com/app/angry-birds-2/id889363906',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.rovio.baba'
  },
  {
    id: 'pokemon-go',
    name: 'Pokémon GO',
    subtitle: 'Niantic, Inc.',
    rating: 4.3,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/6f/ba/4f/6fba4fa7-a958-f96e-6761-7d848fd21600/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    age: '9+ (Everyone)',
    category: 'AR Adventure',
    appleUrl: 'https://apps.apple.com/app/pok%C3%A9mon-go/id1094591345',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.nianticlabs.pokemongo'
  },
  {
    id: 'sonic-dash',
    name: 'Sonic Dash',
    subtitle: 'SEGA',
    rating: 4.7,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/17/97/6d/17976d1b-7b16-b5eb-a1df-8d93e4263638/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    age: '4+ (Everyone)',
    category: 'Arcade Runner',
    appleUrl: 'https://apps.apple.com/app/sonic-dash-endless-running/id582654048',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.sega.sonicdash'
  },
  {
    id: 'toca-boca-world',
    name: 'Toca Boca World',
    subtitle: 'Toca Boca AB',
    rating: 4.7,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/56/05/ed/5605ed73-7d1e-4011-82a0-f805fca11922/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg',
    age: '4+ (Everyone)',
    category: 'Creative Sandbox',
    appleUrl: 'https://apps.apple.com/app/toca-life-world-build-stories/id1201319801',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.tocaboca.tocalifeworld'
  },
  {
    id: 'monument-valley',
    name: 'Monument Valley',
    subtitle: 'ustwo games',
    rating: 4.9,
    coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/21/8e/d8/218ed8a3-c616-9ec7-419e-368073b9deb7/AppIcon-0-0-1x_U007emarketing-0-8-0-85-220.png/512x512bb.jpg',
    age: '9+ (Everyone)',
    category: 'Optical Puzzle',
    appleUrl: 'https://apps.apple.com/app/monument-valley/id728293409',
    googleUrl: 'https://play.google.com/store/apps/details?id=com.ustwo.monumentvalley'
  }
];

// Helper to double list for 0-gap seamless looping
const ROW_1 = [...POPULAR_FEATURED_GAMES, ...POPULAR_FEATURED_GAMES];
const ROW_2 = [...POPULAR_FEATURED_GAMES.slice().reverse(), ...POPULAR_FEATURED_GAMES.slice().reverse()];

export function GameCoverLoop() {
  return (
    <div className="w-full space-y-3.5 my-8">
      <div className="flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Most Recommended Games Across Dual Stores
          </h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Official Store Artwork</span>
          <span>•</span>
          <span>Ages 1–30</span>
        </div>
      </div>

      <div className="game-marquee-container">
        {/* Row 1: Leftward continuous glide */}
        <div className="game-marquee-track game-marquee-row-left gap-4 pb-2">
          {ROW_1.map((game, idx) => (
            <div
              key={`r1-${game.id}-${idx}`}
              className="game-cover-card w-44 sm:w-52 p-3 rounded-2xl apple-glass flex items-center gap-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt={game.name}
                loading="lazy"
                draggable={false}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md border border-slate-200/50 dark:border-slate-800/80 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {game.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {game.rating}
                  </span>
                  <span>•</span>
                  <span className="truncate">{game.age}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                  <a
                    href={game.appleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 transition-colors p-0.5"
                    title="Apple App Store"
                  >
                    <AppleIcon className="w-3 h-3" />
                  </a>
                  <a
                    href={game.googleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 transition-colors p-0.5"
                    title="Google Play Store"
                  >
                    <Smartphone className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-slate-400 font-medium truncate ml-auto">
                    {game.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Rightward continuous glide */}
        <div className="game-marquee-track game-marquee-row-right gap-4 pt-1">
          {ROW_2.map((game, idx) => (
            <div
              key={`r2-${game.id}-${idx}`}
              className="game-cover-card w-44 sm:w-52 p-3 rounded-2xl apple-glass flex items-center gap-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt={game.name}
                loading="lazy"
                draggable={false}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md border border-slate-200/50 dark:border-slate-800/80 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {game.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                    {game.rating}
                  </span>
                  <span>•</span>
                  <span className="truncate">{game.age}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
                  <a
                    href={game.appleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-indigo-400 transition-colors p-0.5"
                    title="Apple App Store"
                  >
                    <AppleIcon className="w-3 h-3" />
                  </a>
                  <a
                    href={game.googleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-emerald-400 transition-colors p-0.5"
                    title="Google Play Store"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] text-slate-400 font-medium truncate ml-auto">
                    {game.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameCoverLoop;
