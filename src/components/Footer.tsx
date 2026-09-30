import Link from "next/link";
import { Flame, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-stone-200/80 dark:border-stone-800/80 bg-white/60 dark:bg-[#0d0e12]/80 backdrop-blur-md mt-auto py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
        
        {/* Brand info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-white/20" />
          </div>
          <span className="font-display font-bold text-stone-800 dark:text-stone-200">
            Pantry<span className="text-brand-500">Pro</span>
          </span>
          <span className="text-stone-400 dark:text-stone-600">•</span>
          <span>The Intent-Driven Culinary Curation Engine</span>
        </div>

        {/* Creator attribution */}
        <div className="flex items-center gap-1.5">
          <span>Created with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
          <span>by</span>
          <a
            href="https://ranjanr.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-stone-800 dark:text-stone-100 hover:text-brand-500 dark:hover:text-brand-400 underline decoration-brand-500/40 underline-offset-4 transition-colors"
          >
            Rakesh Ranjan
          </a>
        </div>
      </div>
    </footer>
  );
}
