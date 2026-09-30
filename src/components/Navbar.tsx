"use client";

import Link from "next/link";
import { Sparkles, Flame, Bookmark } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  onOpenSynthesizer?: () => void;
  vaultCount?: number;
}

export function Navbar({ onOpenSynthesizer, vaultCount = 0 }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/80 dark:bg-[#0d0e12]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-xl tracking-tight text-stone-900 dark:text-white">
                Pantry<span className="text-brand-500">Pro</span>
              </span>
            </div>
            <p className="hidden md:block text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
              The Intent-Driven Culinary Curation Engine
            </p>
          </div>
        </Link>

        {/* Right Action Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Synthesizer Button */}
          {onOpenSynthesizer && (
            <button
              onClick={onOpenSynthesizer}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 hover:brightness-110 transition active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Synthesize Dish</span>
            </button>
          )}

          {/* My Vault Link */}
          <Link
            href="/vault"
            className="relative p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-stone-700 dark:text-stone-300"
            aria-label="My Recipe Vault"
          >
            <Bookmark className="w-4 h-4 text-brand-500" />
            {vaultCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0d0e12]">
                {vaultCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
