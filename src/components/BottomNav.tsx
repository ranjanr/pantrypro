"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Bookmark } from "lucide-react";

interface BottomNavProps {
  onOpenSynthesizer?: () => void;
  vaultCount?: number;
}

export function BottomNav({
  onOpenSynthesizer,
  vaultCount = 0,
}: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#121319]/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800 px-6 py-2 flex items-center justify-around shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
          pathname === "/" ? "text-brand-500 font-semibold" : "text-stone-500 dark:text-stone-400"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px]">Matcher</span>
      </Link>

      <button
        onClick={onOpenSynthesizer}
        className="flex flex-col items-center gap-1 py-1 px-3 rounded-2xl text-stone-500 dark:text-stone-400 hover:text-brand-500 transition cursor-pointer"
      >
        <div className="p-1.5 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-500 text-white shadow-md shadow-brand-500/20">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-medium text-brand-500">Synthesize</span>
      </button>

      <Link
        href="/vault"
        className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition ${
          pathname === "/vault" ? "text-brand-500 font-semibold" : "text-stone-500 dark:text-stone-400"
        }`}
      >
        <div className="relative">
          <Bookmark className="w-5 h-5" />
          {vaultCount > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-brand-500 text-white text-[9px] font-bold flex items-center justify-center">
              {vaultCount}
            </span>
          )}
        </div>
        <span className="text-[10px]">My Vault</span>
      </Link>
    </nav>
  );
}
