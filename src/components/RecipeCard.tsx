"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, Flame, Heart, Sparkles, ChefHat, Play, Check } from "lucide-react";
import { Recipe, FlavorProfile, DietaryFlag } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onCookNow: (recipe: Recipe) => void;
  onToggleVault?: (recipeId: string) => Promise<boolean>;
}

export function RecipeCard({ recipe, onSelect, onCookNow, onToggleVault }: RecipeCardProps) {
  const [isSaved, setIsSaved] = useState(Boolean(recipe.savedInVault));
  const [isSaving, setIsSaving] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleVaultClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!recipe._id) return;
    setIsSaving(true);
    try {
      if (onToggleVault) {
        const nextState = await onToggleVault(recipe._id);
        setIsSaved(nextState);
      } else {
        const res = await fetch("/api/recipes/vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: recipe._id }),
        });
        const data = await res.json();
        if (data.success) {
          setIsSaved(data.saved);
        }
      }
    } catch {
      // fallback
    } finally {
      setIsSaving(false);
    }
  };

  const getFlavorColor = (flavor: FlavorProfile) => {
    switch (flavor) {
      case "Spicy":
        return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Umami-rich":
        return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Zesty & Tangy":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Creamy":
        return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Smoky":
        return "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "Fresh & Herbaceous":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Sweet & Savory":
        return "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/20";
      case "Comforting":
      default:
        return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    }
  };

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group relative flex flex-col bg-white dark:bg-[#14151c] border border-stone-200/90 dark:border-stone-800/90 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-500/40 transition-all duration-300 cursor-pointer"
    >
      {/* Recipe Image Banner with Tags */}
      <div className="relative w-full h-48 sm:h-52 bg-stone-200 dark:bg-stone-800 overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          priority={false}
        />
        
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Prep Time & Match Score Pill */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10 pointer-events-auto">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>{recipe.totalTimeMinutes}m</span>
            </div>

            {typeof recipe.vectorScore === "number" && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md text-xs font-bold border pointer-events-auto shadow-sm ${
                  recipe.vectorScore >= 70
                    ? "bg-emerald-500/80 text-white border-emerald-400/40"
                    : recipe.vectorScore >= 40
                    ? "bg-amber-500/80 text-stone-900 border-amber-400/40"
                    : "bg-black/60 text-stone-300 border-white/10"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{recipe.vectorScore}% Match</span>
              </div>
            )}
          </div>

          {/* Vault Heart Button */}
          <button
            onClick={handleVaultClick}
            disabled={isSaving}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 hover:bg-black/80 transition pointer-events-auto active:scale-90"
            aria-label="Save to Vault"
          >
            <Heart
              className={`w-4 h-4 transition ${
                isSaved ? "fill-rose-500 text-rose-500 scale-110" : "text-white/80"
              }`}
            />
          </button>
        </div>

        {/* Bottom Cuisine & Macros on Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
          <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/10">
            {recipe.cuisine}
          </span>
          {recipe.macros && (
            <span className="font-medium text-[11px] bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {recipe.macros.proteinGrams}g Protein • {recipe.macros.calories} kcal
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Dietary Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {recipe.dietaryFlags.slice(0, 3).map((flag) => (
              <span
                key={flag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              >
                {flag}
              </span>
            ))}
          </div>

          {/* Title & Tagline */}
          <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 group-hover:text-brand-500 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 mt-1 leading-relaxed">
            {recipe.tagline}
          </p>
        </div>

        {/* Flavor Profile Tags */}
        <div className="flex flex-wrap gap-1">
          {recipe.flavorProfiles.map((fp) => (
            <span
              key={fp}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getFlavorColor(
                fp
              )}`}
            >
              {fp}
            </span>
          ))}
        </div>

        {/* Pro Chef Teaser Highlight */}
        {recipe.proChefTips?.heatControl && (
          <div className="p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-stone-700 dark:text-amber-200/90 flex items-start gap-2">
            <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="line-clamp-1 font-mono text-[11px]">
              <strong className="font-semibold text-amber-600 dark:text-amber-400">Chef Touch:</strong>{" "}
              {recipe.proChefTips.heatControl}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(recipe);
            }}
            className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-brand-500 transition flex items-center gap-1"
          >
            <ChefHat className="w-3.5 h-3.5 text-brand-500" />
            <span>Chef Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCookNow(recipe);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-brand-500/20 transition active:scale-95"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Focus Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
}
