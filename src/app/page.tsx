"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { FridgeInput } from "@/components/FridgeInput";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { CookingFocusMode } from "@/components/CookingFocusMode";
import { SynthesizeModal } from "@/components/SynthesizeModal";
import { AtlasSetupGuideModal } from "@/components/AtlasSetupGuideModal";
import { Recipe } from "@/lib/types";
import { Sparkles, Flame, Zap, Database, ArrowUpRight, ChefHat, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isVectorSearch, setIsVectorSearch] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [vaultCount, setVaultCount] = useState(0);
  const [currentQuery, setCurrentQuery] = useState("");

  // Modals
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [focusRecipe, setFocusRecipe] = useState<Recipe | null>(null);
  const [synthesizerOpen, setSynthesizerOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);

  // Fetch initial recipes
  const loadRecipes = useCallback(
    async (params?: { query?: string; maxTime?: number; dietary?: string[] }) => {
      setIsSearching(true);
      setCurrentQuery(params?.query || "");
      try {
        const queryParams = new URLSearchParams();
        if (params?.query) queryParams.set("q", params.query);
        if (params?.maxTime) queryParams.set("maxTime", params.maxTime.toString());
        if (params?.dietary && params.dietary.length > 0)
          queryParams.set("dietary", params.dietary.join(","));

        const res = await fetch(`/api/recipes?${queryParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setRecipes(data.data || []);
          setIsVectorSearch(Boolean(data.isVectorSearch));
          setFallbackMode(Boolean(data.fallbackMode));
        }
      } catch (err) {
        console.error("Failed to load recipes:", err);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    []
  );

  const loadVaultCount = async () => {
    try {
      const res = await fetch("/api/recipes/vault");
      const data = await res.json();
      if (data.success) {
        setVaultCount(data.count || 0);
      }
    } catch {}
  };

  useEffect(() => {
    loadRecipes();
    loadVaultCount();
  }, [loadRecipes]);

  const handleToggleVault = async (recipeId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/recipes/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();
      if (data.success) {
        loadVaultCount();
        setRecipes((prev) =>
          prev.map((r) => (r._id === recipeId ? { ...r, savedInVault: data.saved } : r))
        );
        return data.saved;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleRecipeSynthesized = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    loadVaultCount();
    setSelectedRecipe(newRecipe);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d0e12] text-stone-900 dark:text-stone-100 flex flex-col pb-20 sm:pb-12 transition-colors">
      {/* Top Navigation */}
      <Navbar
        onOpenSynthesizer={() => setSynthesizerOpen(true)}
        vaultCount={vaultCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8">
        
        {/* Hero Banner */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold border border-brand-500/20 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MongoDB Atlas Vector Search & Gemini 2.5 Pro</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-stone-900 dark:text-white leading-[1.1]">
            Turn Leftovers into <span className="bg-gradient-to-r from-brand-500 to-amber-500 bg-clip-text text-transparent">Pro-Grade Cuisine</span> in Minutes.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            High-yield, fast recipes tailored for busy professionals & students. Semantic vector matching, dynamic heat/acidity rewriting, and hands-free cooking mode.
          </p>
        </section>

        {/* What's in Your Fridge Matcher Input */}
        <section className="space-y-3">
          <FridgeInput
            onSearch={loadRecipes}
            isSearching={isSearching}
            onOpenSynthesizer={() => setSynthesizerOpen(true)}
          />
        </section>

        {/* Results Metadata Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {recipes.length} Curated Dishes
            </span>
            {isVectorSearch && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border border-emerald-500/20">
                <Database className="w-3 h-3" />
                Vector Cosine Ranked
              </span>
            )}
            {currentQuery && (
              <span className="text-[11px] text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md font-medium">
                Query: &ldquo;{currentQuery}&rdquo;
              </span>
            )}
          </div>

          <button
            onClick={() => setSynthesizerOpen(true)}
            className="flex items-center gap-1 font-semibold text-brand-500 hover:text-brand-600 transition"
          >
            <span>Custom Pantry Synthesis</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </section>

        {/* Recipe Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl bg-stone-200 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto bg-white dark:bg-[#14151c] p-8 rounded-3xl border border-stone-200 dark:border-stone-800">
              <ChefHat className="w-12 h-12 mx-auto text-brand-500 opacity-60" />
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                  No direct vector matches found
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Synthesize an entirely new recipe using your exact leftover ingredients with Gemini AI!
                </p>
              </div>
              <button
                onClick={() => setSynthesizerOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/25 transition"
              >
                Synthesize from Fridge
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id || recipe.title}
                  recipe={recipe}
                  onSelect={(r) => setSelectedRecipe(r)}
                  onCookNow={(r) => setFocusRecipe(r)}
                  onToggleVault={handleToggleVault}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Mobile Bottom Sheet Navigation */}
      <BottomNav
        onOpenSynthesizer={() => setSynthesizerOpen(true)}
        onOpenGuide={() => setGuideOpen(true)}
        vaultCount={vaultCount}
      />

      {/* Recipe Detail & Persona Rewriting Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={Boolean(selectedRecipe)}
        onClose={() => setSelectedRecipe(null)}
        onCookNow={(r) => {
          setSelectedRecipe(null);
          setFocusRecipe(r);
        }}
        onToggleVault={handleToggleVault}
      />

      {/* Cooking Focus Mode Full-Screen HUD */}
      <CookingFocusMode
        recipe={focusRecipe}
        isOpen={Boolean(focusRecipe)}
        onClose={() => setFocusRecipe(null)}
      />

      {/* AI Pantry Synthesizer Modal */}
      <SynthesizeModal
        isOpen={synthesizerOpen}
        onClose={() => setSynthesizerOpen(false)}
        onRecipeSynthesized={handleRecipeSynthesized}
        initialIngredients={
          currentQuery
            ? currentQuery
                .split(/[\s,;+&]+/)
                .map((s) => s.trim())
                .filter((s) => s.length > 1)
            : undefined
        }
      />

      {/* Atlas Vector Setup Guide */}
      <AtlasSetupGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
        isMongoConnected={!fallbackMode}
      />
    </div>
  );
}
