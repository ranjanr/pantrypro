"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Clock,
  Flame,
  ChefHat,
  Sparkles,
  Heart,
  Play,
  CheckCircle2,
  Circle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Utensils,
  Lightbulb,
  Zap,
} from "lucide-react";
import { Recipe, ChefPersonaType, RewrittenRecipeResponse } from "@/lib/types";
import { CHEF_PERSONAS } from "@/lib/seed-data";
import { AskChefChat } from "./AskChefChat";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onCookNow: (recipe: Recipe) => void;
  onToggleVault?: (recipeId: string) => Promise<boolean>;
}

export function RecipeDetailModal({
  recipe,
  isOpen,
  onClose,
  onCookNow,
  onToggleVault,
}: RecipeDetailModalProps) {
  const [selectedPersona, setSelectedPersona] = useState<ChefPersonaType>("michelin_pro");
  const [rewrittenData, setRewrittenData] = useState<RewrittenRecipeResponse | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(recipe?.savedInVault || false);
  const [activeTab, setActiveTab] = useState<"recipe" | "askChef">("recipe");

  if (!isOpen || !recipe) return null;

  const handleRewrite = async (persona: ChefPersonaType) => {
    setSelectedPersona(persona);
    setIsRewriting(true);
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe, persona }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setRewrittenData(data.data);
      }
    } catch (err) {
      console.error("Rewrite failed:", err);
    } finally {
      setIsRewriting(false);
    }
  };

  const toggleIngredientCheck = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleVaultToggle = async () => {
    if (!recipe._id) return;
    if (onToggleVault) {
      const saved = await onToggleVault(recipe._id);
      setIsSaved(saved);
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
  };

  const instructionsToDisplay = rewrittenData
    ? rewrittenData.revisedInstructions
    : recipe.instructions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden bg-white dark:bg-[#121319] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl flex flex-col">
        
        {/* Header Bar */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3.5 bg-white/90 dark:bg-[#121319]/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              {recipe.cuisine}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("recipe")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition ${
                  activeTab === "recipe"
                    ? "bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900"
                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                Recipe & Pro Rewriter
              </button>
              <button
                onClick={() => setActiveTab("askChef")}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                  activeTab === "askChef"
                    ? "bg-brand-500 text-white"
                    : "text-stone-500 hover:text-brand-500"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Ask Chef AI</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleVaultToggle}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              title="Save to Vault"
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? "fill-rose-500 text-rose-500" : "text-stone-600 dark:text-stone-300"
                }`}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-stone-600 dark:text-stone-300" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {activeTab === "askChef" ? (
            <AskChefChat recipe={recipe} selectedPersona={selectedPersona} />
          ) : (
            <>
              {/* Recipe Title & Hero Block */}
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-stone-900 dark:text-white">
                  {recipe.title}
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                  {rewrittenData ? rewrittenData.enhancedTagline : recipe.tagline}
                </p>

                {/* Quick stats pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold text-stone-700 dark:text-stone-300">
                    <Clock className="w-3.5 h-3.5 text-brand-500" />
                    Prep: {recipe.prepTimeMinutes}m | Cook: {recipe.cookTimeMinutes}m
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 font-semibold text-stone-700 dark:text-stone-300">
                    <Utensils className="w-3.5 h-3.5 text-amber-500" />
                    Serves {recipe.servings}
                  </span>
                  {recipe.macros && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                      {recipe.macros.proteinGrams}g Protein • {recipe.macros.calories} kcal
                    </span>
                  )}
                </div>
              </div>

              {/* Pro Chef Persona Rewriter Bar */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-brand-500/5 to-transparent border border-brand-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-500 text-white rounded-xl shadow-md shadow-brand-500/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-white font-display">
                        The Chef&apos;s Touch: Dynamic Persona Rewriting
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Select a persona to dynamically elevate heat control, acid balance, and techniques via Gemini
                      </p>
                    </div>
                  </div>
                  {isRewriting && (
                    <span className="text-xs font-semibold text-brand-500 flex items-center gap-1 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Rewriting...
                    </span>
                  )}
                </div>

                {/* Persona selector tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {CHEF_PERSONAS.map((p) => {
                    const isSelected = selectedPersona === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleRewrite(p.id)}
                        disabled={isRewriting}
                        className={`p-2.5 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? "bg-white dark:bg-stone-900 border-brand-500 shadow-md ring-2 ring-brand-500/20 scale-[1.02]"
                            : "bg-stone-50/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-900"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-base mb-1">
                          <span>{p.avatar}</span>
                          <span className="text-xs font-bold truncate text-stone-900 dark:text-white">
                            {p.name.split(" ")[1]}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-2">
                          {p.subtitle}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gemini Pro Secrets Callout Grid (when persona is applied or default) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Heat & Thermal Control</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-mono">
                    {rewrittenData?.proSecrets?.heatControl || recipe.proChefTips?.heatControl}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Acidity & Brighteners</span>
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-mono">
                    {rewrittenData?.proSecrets?.acidityAndBrighteners || recipe.proChefTips?.acidityBalance}
                  </p>
                </div>

                {rewrittenData?.proSecrets?.texturalContrast && (
                  <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Textural Contrast</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-mono">
                      {rewrittenData.proSecrets.texturalContrast}
                    </p>
                  </div>
                )}

                {rewrittenData?.proSecrets?.restingAndFinishing && (
                  <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Resting & Finishing</span>
                    </div>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-mono">
                      {rewrittenData.proSecrets.restingAndFinishing}
                    </p>
                  </div>
                )}
              </div>

              {/* Two Column Section: Ingredients Checklist & Pro Instructions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Ingredients Checklist (Left Column) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Utensils className="w-4 h-4 text-brand-500" />
                      <span>Ingredients</span>
                    </h3>
                    <span className="text-xs text-stone-400">
                      {Object.values(checkedIngredients).filter(Boolean).length} of {recipe.ingredients.length} ready
                    </span>
                  </div>

                  <div className="space-y-2 bg-stone-50 dark:bg-stone-900/50 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800">
                    {recipe.ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients[idx];
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleIngredientCheck(idx)}
                          className={`flex items-start gap-2.5 p-2 rounded-xl transition cursor-pointer ${
                            isChecked
                              ? "bg-emerald-500/10 text-stone-400 dark:text-stone-500 line-through"
                              : "hover:bg-white dark:hover:bg-stone-800/80 text-stone-800 dark:text-stone-200"
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                          )}
                          <div className="text-xs">
                            <span className="font-semibold">{ing.amount}</span> {ing.item}
                            {ing.notes && (
                              <span className="block text-[11px] text-stone-500 dark:text-stone-400 not-italic">
                                ({ing.notes})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Suggested Swaps from Persona */}
                  {rewrittenData?.suggestedPantrySwaps && rewrittenData.suggestedPantrySwaps.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
                      <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        <span>Smart Pantry Swaps</span>
                      </h4>
                      <div className="space-y-1.5">
                        {rewrittenData.suggestedPantrySwaps.map((swap, sIdx) => (
                          <div key={sIdx} className="text-xs text-stone-600 dark:text-stone-300">
                            <strong>{swap.original}</strong> &rarr; <span className="text-brand-500 font-semibold">{swap.swap}</span>
                            <span className="block text-[10px] text-stone-400">{swap.rationale}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions Column (Right Column) */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4 text-brand-500" />
                      <span>Culinary Steps ({instructionsToDisplay.length})</span>
                    </h3>
                    {rewrittenData && (
                      <span className="text-xs text-brand-500 font-semibold">
                        ✨ Persona Refined
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {instructionsToDisplay.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                            {step.stepNumber}
                          </span>
                          {step.durationMinutes && (
                            <span className="text-[11px] font-mono text-stone-400">
                              ~{step.durationMinutes} min
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-sans">
                          {step.instruction}
                        </p>
                        {step.chefTip && (
                          <div className="p-2.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs text-brand-700 dark:text-brand-300 flex items-start gap-1.5 font-mono text-[11px]">
                            <Flame className="w-3.5 h-3.5 text-brand-500 shrink-0 mt-0.5" />
                            <span>{step.chefTip}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 z-20 px-4 sm:px-6 py-3 bg-white/95 dark:bg-[#121319]/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400 hidden sm:block">
            Screen will stay awake during Focus Cooking Mode
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onCookNow(
                  rewrittenData
                    ? {
                        ...recipe,
                        instructions: rewrittenData.revisedInstructions,
                      }
                    : recipe
                );
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:brightness-110 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Focus Cooking Mode</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
