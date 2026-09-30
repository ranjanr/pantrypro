"use client";

import { useState } from "react";
import { Send, Bot, User, Sparkles, Flame, Check } from "lucide-react";
import { Recipe, ChefPersonaType } from "@/lib/types";

interface AskChefChatProps {
  recipe: Recipe;
  selectedPersona?: ChefPersonaType;
}

interface Message {
  role: "user" | "chef";
  text: string;
}

export function AskChefChat({ recipe, selectedPersona }: AskChefChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "chef",
      text: `Bonjour! I'm your AI Sous Chef for "${recipe.title}". Need a 30-second substitution, pan temperature check, or sauce fix? Ask away!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What can I replace this with if I don't have it?",
    "My pan is smoking too fast, what do I do?",
    "How do I balance the acidity?",
    "How to get maximum crispiness?",
  ];

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/ask-chef", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeTitle: recipe.title,
          recipeIngredients: recipe.ingredients.map((i) => `${i.amount} ${i.item}`),
          question: textToSend,
          personaType: selectedPersona,
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setMessages((prev) => [...prev, { role: "chef", text: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "chef",
            text: "Chef tip: Keep heat steady on medium, taste for salt, and finish with a squeeze of citrus to brighten the flavours.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "chef",
          text: "Chef connection hiccup! Remember the golden rule: balance rich fats with sharp acid (lime or vinegar) and fresh herbs.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[520px] bg-stone-50 dark:bg-stone-900/60 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "chef" && (
              <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <Flame className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[82%] text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-medium rounded-tr-none"
                  : "bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700/80 rounded-tl-none shadow-sm font-sans"
              }`}
            >
              {msg.text}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-stone-400 p-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce [animation-delay:0.4s]" />
            <span className="font-mono text-[11px] ml-1">Chef is formulating advice...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Carousel */}
      <div className="px-3 py-2 bg-stone-100/80 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(p)}
            disabled={loading}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-600 dark:text-stone-300 hover:border-brand-500/50 whitespace-nowrap transition shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-[#121319] border-t border-stone-200 dark:border-stone-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask chef about heat, swaps, timing..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-900 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-40 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
