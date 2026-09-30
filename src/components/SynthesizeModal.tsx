"use client";

import { useState } from "react";
import { X, Sparkles, Plus, Trash2, Clock, Check, Utensils, Flame } from "lucide-react";
import { Recipe, DietaryFlag } from "@/lib/types";
import { POPULAR_FRIDGE_ITEMS } from "@/lib/seed-data";

interface SynthesizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecipeSynthesized: (recipe: Recipe) => void;
  initialIngredients?: string[];
}

export function SynthesizeModal({
  isOpen,
  onClose,
  onRecipeSynthesized,
  initialIngredients,
}: SynthesizeModalProps) {
  const [ingredients, setIngredients] = useState<string[]>(
    initialIngredients && initialIngredients.length > 0
      ? initialIngredients
      : ["Paneer", "Baby Spinach", "Leftover Rice"]
  );
  const [customInput, setCustomInput] = useState("");
  const [maxTime, setMaxTime] = useState(15);
  const [selectedDietary, setSelectedDietary] = useState<DietaryFlag[]>([
    "Vegetarian",
    "Eggless",
  ]);
  const [cuisine, setCuisine] = useState("Modern Fusion");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddIngredient = (item: string) => {
    if (item.trim() && !ingredients.includes(item.trim())) {
      setIngredients([...ingredients, item.trim()]);
      setCustomInput("");
    }
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const toggleDietary = (flag: DietaryFlag) => {
    setSelectedDietary((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleSynthesize = async () => {
    if (ingredients.length === 0) {
      setErrorMsg("Please add at least 1 ingredient from your pantry/fridge.");
      return;
    }

    setIsSynthesizing(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fridgeItems: ingredients,
          dietaryPreferences: selectedDietary,
          maxPrepTimeMinutes: maxTime,
          cuisinePreference: cuisine,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onRecipeSynthesized(data.data);
        onClose();
      } else {
        setErrorMsg(data.error || "Failed to synthesize recipe.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-[#13141a] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-brand-500 to-amber-500 text-white rounded-2xl shadow-lg shadow-brand-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white">
                AI Pantry Synthesizer
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Turn your exact fridge leftovers into a gourmet weeknight recipe in seconds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
          >
            <X className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Current Items Pills */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Ingredients in Your Fridge / Pantry ({ingredients.length})
          </label>
          
          <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 min-h-[50px] items-center">
            {ingredients.map((item, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/30 text-xs font-semibold"
              >
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveIngredient(idx)}
                  className="hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {ingredients.length === 0 && (
              <span className="text-xs text-stone-400 italic">No ingredients added yet...</span>
            )}
          </div>

          {/* Add custom item */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddIngredient(customInput);
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type an ingredient (e.g., coconut milk, tofu, lime)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold flex items-center gap-1 hover:opacity-90 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
            <span className="text-[11px] text-stone-400 shrink-0">Suggestions:</span>
            {POPULAR_FRIDGE_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddIngredient(item)}
                className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] whitespace-nowrap hover:bg-brand-500/10 hover:text-brand-500 transition"
              >
                +{item}
              </button>
            ))}
          </div>
        </div>

        {/* Max Cooking Time */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Target Cooking Time</span>
            </label>
            <span className="text-xs font-mono font-bold text-brand-500">{maxTime} minutes</span>
          </div>
          <input
            type="range"
            min={8}
            max={40}
            step={2}
            value={maxTime}
            onChange={(e) => setMaxTime(parseInt(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>⚡ 8m (Flash)</span>
            <span>⏱️ 20m (Weeknight)</span>
            <span>🍲 40m (Gourmet)</span>
          </div>
        </div>

        {/* Dietary Flags */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Dietary Constraints
          </label>
          <div className="flex flex-wrap gap-2">
            {(["Vegetarian", "Vegan", "Eggless", "Gluten-Free", "High-Protein", "Dairy-Free"] as DietaryFlag[]).map(
              (flag) => {
                const isSelected = selectedDietary.includes(flag);
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => toggleDietary(flag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      isSelected
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                        : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800"
                    }`}
                  >
                    {flag}
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Cuisine Preference */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            Cuisine Direction
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "Modern Fusion",
              "Indo-Mexican Fusion",
              "Japanese-French",
              "Coastal Indian",
              "Mexican Quick-Bite",
              "Modern Mediterranean",
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCuisine(c)}
                className={`p-2 rounded-xl text-xs font-medium text-left border transition ${
                  cuisine === c
                    ? "bg-brand-500/10 border-brand-500 text-brand-600 dark:text-brand-400 font-bold"
                    : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs text-stone-400 font-mono">
            Directly saved to Atlas Vault
          </span>
          <button
            onClick={handleSynthesize}
            disabled={isSynthesizing}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:brightness-110 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition disabled:opacity-50"
          >
            {isSynthesizing ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Crafting Recipe with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize Recipe</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
