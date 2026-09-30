"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetailModal } from "@/components/RecipeDetailModal";
import { CookingFocusMode } from "@/components/CookingFocusMode";
import { SynthesizeModal } from "@/components/SynthesizeModal";
import { Recipe } from "@/lib/types";
import { Bookmark, ArrowLeft, Plus, Sparkles, ChefHat, Flame, Clock } from "lucide-react";

export default function VaultPage() {
  const [vaultRecipes, setVaultRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [focusRecipe, setFocusRecipe] = useState<Recipe | null>(null);
  const [synthesizerOpen, setSynthesizerOpen] = useState(false);

  const loadVault = async () => {
    try {
      const res = await fetch("/api/recipes/vault");
      const data = await res.json();
      if (data.success) {
        setVaultRecipes(data.data || []);
      }
    } catch (err) {
      console.error("Vault load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVault();
  }, []);

  const handleToggleVault = async (recipeId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/recipes/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();
      if (data.success) {
        if (!data.saved) {
          setVaultRecipes((prev) => prev.filter((r) => r._id !== recipeId));
        }
        return data.saved;
      }
      return false;
    } catch {
      return false;
    }
  };

  const totalProtein = vaultRecipes.reduce(
    (sum, r) => sum + (r.macros?.proteinGrams || 0),
    0
  );
  const avgTime =
    vaultRecipes.length > 0
      ? Math.round(
          vaultRecipes.reduce((sum, r) => sum + r.totalTimeMinutes, 0) /
            vaultRecipes.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0d0e12] text-stone-900 dark:text-stone-100 flex flex-col pb-20 sm:pb-12 transition-colors">
      <Navbar
        onOpenSynthesizer={() => setSynthesizerOpen(true)}
        vaultCount={vaultRecipes.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-8">
        {/* Header & Vault Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:text-brand-600 transition mb-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Matcher</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-brand-500/10 text-brand-500 border border-brand-500/20 flex items-center justify-center">
                <Bookmark className="w-5 h-5 fill-brand-500/20" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-black tracking-tight text-stone-900 dark:text-white">
                My Culinary Vault
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Your preserved curated collection & custom synthesized recipes in MongoDB Atlas.
            </p>
          </div>

          <button
            onClick={() => setSynthesizerOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-brand-500/20 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Synthesize New Dish</span>
          </button>
        </div>

        {/* Vault Stats Cards */}
        {vaultRecipes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#14151c] border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Saved Dishes
              </span>
              <div className="text-2xl font-bold font-display text-brand-500">
                {vaultRecipes.length}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#14151c] border border-stone-200 dark:border-stone-800 space-y-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Avg. Prep & Cook
              </span>
              <div className="text-2xl font-bold font-display text-amber-500 flex items-center gap-1">
                <Clock className="w-5 h-5" />
                <span>{avgTime} mins</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-[#14151c] border border-stone-200 dark:border-stone-800 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Total Protein Vaulted
              </span>
              <div className="text-2xl font-bold font-display text-emerald-500">
                {totalProtein}g
              </div>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-3xl bg-stone-200 dark:bg-stone-800 animate-pulse"
                />
              ))}
            </div>
          ) : vaultRecipes.length === 0 ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto bg-white dark:bg-[#14151c] p-8 rounded-3xl border border-stone-200 dark:border-stone-800">
              <Bookmark className="w-12 h-12 mx-auto text-brand-500 opacity-40" />
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                  Your Vault is Empty
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Save recipes from the Matcher or synthesize custom meals to build your personal collection.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600 transition"
              >
                <span>Browse Recipes</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vaultRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id || recipe.title}
                  recipe={{ ...recipe, savedInVault: true }}
                  onSelect={(r) => setSelectedRecipe(r)}
                  onCookNow={(r) => setFocusRecipe(r)}
                  onToggleVault={handleToggleVault}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <BottomNav
        onOpenSynthesizer={() => setSynthesizerOpen(true)}
        vaultCount={vaultRecipes.length}
      />

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

      <CookingFocusMode
        recipe={focusRecipe}
        isOpen={Boolean(focusRecipe)}
        onClose={() => setFocusRecipe(null)}
      />

      <SynthesizeModal
        isOpen={synthesizerOpen}
        onClose={() => setSynthesizerOpen(false)}
        onRecipeSynthesized={(newR) => {
          setVaultRecipes((prev) => [newR, ...prev]);
          setSelectedRecipe(newR);
        }}
      />
    </div>
  );
}
