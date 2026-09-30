"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Mic, MicOff, Sparkles, SlidersHorizontal, X, ArrowRight, Clock, ShieldAlert } from "lucide-react";
import { POPULAR_FRIDGE_ITEMS } from "@/lib/seed-data";
import { DietaryFlag } from "@/lib/types";

interface FridgeInputProps {
  onSearch: (params: { query: string; maxTime?: number; dietary: string[] }) => void;
  isSearching: boolean;
  onOpenSynthesizer?: () => void;
}

const DIETARY_OPTIONS: DietaryFlag[] = [
  "Vegetarian",
  "Vegan",
  "Eggless",
  "Gluten-Free",
  "High-Protein",
  "Dairy-Free",
];

export function FridgeInput({ onSearch, isSearching, onOpenSynthesizer }: FridgeInputProps) {
  const [query, setQuery] = useState("");
  const [maxTime, setMaxTime] = useState<number | undefined>(undefined);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          const updatedQuery = query ? `${query}, ${transcript}` : transcript;
          setQuery(updatedQuery);
          setIsListening(false);
          setVoiceNotice(`Heard: "${transcript}"`);
          setTimeout(() => setVoiceNotice(null), 3000);
          onSearch({ query: updatedQuery, maxTime, dietary: selectedDietary });
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [query, maxTime, selectedDietary, onSearch]);

  const toggleVoice = () => {
    if (speechSupported && recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setIsListening(true);
        try {
          recognitionRef.current.start();
        } catch {
          simulateVoiceInput();
        }
      }
    } else {
      simulateVoiceInput();
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const simulatedQueries = [
      "rice, shrimp",
      "paneer, baby spinach, rice",
      "canned black beans, sweet corn, avocado",
      "ramen noodles, gochujang, garlic",
      "red lentils, coconut milk, curry leaves",
    ];
    const picked = simulatedQueries[Math.floor(Math.random() * simulatedQueries.length)];
    
    setTimeout(() => {
      setQuery(picked);
      setIsListening(false);
      setVoiceNotice(`Simulated Voice: "${picked}"`);
      setTimeout(() => setVoiceNotice(null), 3500);
      onSearch({ query: picked, maxTime, dietary: selectedDietary });
    }, 1000);
  };

  const handleToggleTag = (item: string) => {
    // Clean tag item (e.g. "Shrimp / Prawns" -> "shrimp")
    const cleanItem = item.toLowerCase().split("/")[0].trim();
    let updatedQuery = "";

    const currentItems = query
      .split(/[\s,;+&]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const isAlreadyPresent = currentItems.some((s) => cleanItem.includes(s) || s.includes(cleanItem));

    if (isAlreadyPresent) {
      // Remove it
      const filtered = query
        .split(",")
        .map((s) => s.trim())
        .filter((s) => !s.toLowerCase().includes(cleanItem));
      updatedQuery = filtered.join(", ");
    } else {
      // Add it
      updatedQuery = query ? `${query}, ${cleanItem}` : cleanItem;
    }

    setQuery(updatedQuery);
    onSearch({
      query: updatedQuery,
      maxTime,
      dietary: selectedDietary,
    });
  };

  const toggleDietary = (flag: string) => {
    const updated = selectedDietary.includes(flag)
      ? selectedDietary.filter((f) => f !== flag)
      : [...selectedDietary, flag];
    setSelectedDietary(updated);
    onSearch({ query, maxTime, dietary: updated });
  };

  const handleTriggerSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      query,
      maxTime,
      dietary: selectedDietary,
    });
  };

  const handleClear = () => {
    setQuery("");
    setMaxTime(undefined);
    setSelectedDietary([]);
    onSearch({ query: "", maxTime: undefined, dietary: [] });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Box */}
      <form
        onSubmit={handleTriggerSearch}
        className="relative group bg-white dark:bg-[#15161c] border border-stone-200 dark:border-stone-800 rounded-3xl p-2 sm:p-2.5 shadow-xl shadow-stone-200/50 dark:shadow-none focus-within:border-brand-500/80 focus-within:ring-4 focus-within:ring-brand-500/10 transition-all"
      >
        <div className="flex items-center gap-2 pl-3">
          <Search className="w-5 h-5 text-stone-400 group-focus-within:text-brand-500 transition-colors shrink-0" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What's in your fridge? (e.g., rice, shrimp, paneer...)"
            className="w-full py-2.5 bg-transparent text-sm sm:text-base text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Voice input button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-2xl border transition-all ${
              isListening
                ? "bg-red-500 text-white border-red-600 animate-pulse glow-orange"
                : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
            title={speechSupported ? "Voice to Text" : "Simulate Voice Input"}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-brand-500" />}
          </button>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border transition ${
              showFilters || maxTime || selectedDietary.length > 0
                ? "border-brand-500 bg-brand-500/10 text-brand-500"
                : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            }`}
            title="Filters"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 sm:px-6 py-2.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:brightness-110 text-white text-sm font-semibold shadow-md shadow-brand-500/25 flex items-center gap-2 transition disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {isSearching ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Match Recipes</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Voice feedback banner */}
      {voiceNotice && (
        <div className="text-xs text-brand-600 dark:text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3.5 py-1.5 rounded-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Filter Drawer */}
      {showFilters && (
        <div className="p-4 bg-white dark:bg-[#15161c] border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4 animate-fade-in shadow-lg">
          {/* Prep Time Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>Max Prep & Cook Time</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All Speeds", value: undefined },
                { label: "⚡ < 10 mins (Ultra-Fast)", value: 10 },
                { label: "⏱️ < 20 mins (Weeknight)", value: 20 },
                { label: "🍲 < 30 mins", value: 30 },
              ].map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setMaxTime(opt.value);
                    onSearch({ query, maxTime: opt.value, dietary: selectedDietary });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    maxTime === opt.value
                      ? "bg-brand-500 text-white shadow-md shadow-brand-500/20 font-semibold"
                      : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Flags */}
          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">
              Dietary Preferences
            </div>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((flag) => {
                const isSelected = selectedDietary.includes(flag);
                return (
                  <button
                    key={flag}
                    type="button"
                    onClick={() => toggleDietary(flag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-500/20"
                        : "bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800"
                    }`}
                  >
                    {flag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Fridge Items Tap Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1">
        <span className="text-xs font-semibold text-stone-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-500" />
          Quick Tap:
        </span>
        <div className="flex items-center gap-1.5">
          {POPULAR_FRIDGE_ITEMS.map((item) => {
            const cleanItem = item.toLowerCase().split("/")[0].trim();
            const isActive = query.toLowerCase().includes(cleanItem);

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleToggleTag(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                  isActive
                    ? "bg-brand-500 text-white font-semibold border border-brand-600 shadow-brand-500/25"
                    : "bg-white dark:bg-stone-900/90 text-stone-700 dark:text-stone-200 hover:border-brand-500/60 border border-stone-200/90 dark:border-stone-800"
                }`}
              >
                {isActive ? "✓ " : "+ "}
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
