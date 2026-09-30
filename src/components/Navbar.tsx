"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Database, Bookmark, RefreshCw, Cpu, BookOpen } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AtlasSetupGuideModal } from "./AtlasSetupGuideModal";

interface NavbarProps {
  onOpenSynthesizer?: () => void;
  vaultCount?: number;
}

export function Navbar({ onOpenSynthesizer, vaultCount = 0 }: NavbarProps) {
  const [status, setStatus] = useState<{
    mongo: { connected: boolean; configured: boolean; mode: string };
    gemini: { configured: boolean; model: string; mode: string };
  } | null>(null);

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/recipes/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSeedMessage(`Seeded ${data.count} recipes with embeddings!`);
        setTimeout(() => {
          setSeedMessage(null);
          window.location.reload();
        }, 1200);
      }
    } catch {
      setSeedMessage("Seeding error. Check logs.");
      setTimeout(() => setSeedMessage(null), 3000);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <>
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
                <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold border border-brand-500/20">
                  Vector AI
                </span>
              </div>
              <p className="hidden md:block text-[10px] text-stone-500 dark:text-stone-400 font-medium tracking-wide">
                Intent-Driven Culinary Curation
              </p>
            </div>
          </Link>

          {/* Right Action Center */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* MongoDB Atlas Status Pill */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 text-xs text-stone-700 dark:text-stone-300 hover:border-brand-500/50 transition cursor-pointer"
              title="Click to view MongoDB Atlas Vector Index configuration"
            >
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline font-medium">Atlas Vector</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  status?.mongo.connected
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
            </button>

            {/* AI Engine Status Pill */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900/70 text-xs text-stone-700 dark:text-stone-300"
              title="Google Gemini 2.5 Pro / Flash active"
            >
              <Cpu className="w-3.5 h-3.5 text-brand-500" />
              <span className="font-medium">Gemini 2.5 Pro</span>
            </div>

            {/* Seed DB Button */}
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition disabled:opacity-50"
              title="Seed database with vector embeddings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? "animate-spin text-brand-500" : ""}`} />
              <span>{isSeeding ? "Seeding..." : "Seed DB"}</span>
            </button>

            {/* AI Synthesizer Button */}
            {onOpenSynthesizer && (
              <button
                onClick={onOpenSynthesizer}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 hover:brightness-110 transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Synthesize</span>
              </button>
            )}

            {/* My Vault Link */}
            <Link
              href="/vault"
              className="relative p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800 transition text-stone-700 dark:text-stone-300"
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

        {/* Feedback banner if seeded */}
        {seedMessage && (
          <div className="bg-emerald-500 text-white text-xs py-1 px-4 text-center font-medium animate-fade-in">
            {seedMessage}
          </div>
        )}
      </header>

      <AtlasSetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isMongoConnected={Boolean(status?.mongo.connected)}
      />
    </>
  );
}
