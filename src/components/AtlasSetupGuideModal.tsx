"use client";

import { useState } from "react";
import { X, Database, Copy, Check, Sparkles, ExternalLink } from "lucide-react";

interface AtlasSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMongoConnected: boolean;
}

export function AtlasSetupGuideModal({
  isOpen,
  onClose,
  isMongoConnected,
}: AtlasSetupGuideModalProps) {
  const [copiedIndex, setCopiedIndex] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const atlasIndexJson = JSON.stringify(
    {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: 768,
          similarity: "cosine",
        },
        {
          type: "filter",
          path: "totalTimeMinutes",
        },
        {
          type: "filter",
          path: "dietaryFlags",
        },
      ],
    },
    null,
    2
  );

  const envExample = `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.yourdomain.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=pantrypro
GEMINI_API_KEY=your_google_gemini_api_key_here`;

  const copyToClipboard = (text: string, isEnv = false) => {
    navigator.clipboard.writeText(text);
    if (isEnv) {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else {
      setCopiedIndex(true);
      setTimeout(() => setCopiedIndex(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-50 dark:bg-[#13141a] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 transition"
        >
          <X className="w-5 h-5 text-stone-600 dark:text-stone-300" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-white">
              MongoDB Atlas & Vector Search Setup
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Live Vector Similarity ($vectorSearch) Index Configuration
            </p>
          </div>
        </div>

        {/* Current status pill */}
        <div className="mb-6 p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isMongoConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-stone-700 dark:text-stone-200">
              Atlas Status: {isMongoConnected ? "Connected to Production Atlas" : "In-Memory Vector Sandbox (Ready for Atlas URI)"}
            </span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
            768 dims (Cosine)
          </span>
        </div>

        <div className="space-y-6 text-sm text-stone-600 dark:text-stone-300">
          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs font-bold">1</span>
              <span>Create MongoDB Atlas Cluster & Set .env.local</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 pl-8">
              Copy these variables to your <code>.env.local</code> file:
            </p>
            <div className="relative pl-8">
              <pre className="p-3.5 bg-stone-900 text-stone-200 text-xs rounded-xl font-mono overflow-x-auto border border-stone-800">
                {envExample}
              </pre>
              <button
                onClick={() => copyToClipboard(envExample, true)}
                className="absolute top-2 right-2 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedEnv ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs font-bold">2</span>
              <span>Create Atlas Search Vector Index</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 pl-8">
              In MongoDB Atlas, navigate to <strong>Atlas Search</strong> &rarr; <strong>Create Search Index</strong> &rarr; <strong>Atlas Vector Search (JSON Editor)</strong> on collection <code>recipes</code>. Set the index name to <code>vector_index</code>.
            </p>
            <div className="relative pl-8">
              <pre className="p-3.5 bg-stone-900 text-emerald-300 text-xs rounded-xl font-mono overflow-x-auto border border-stone-800">
                {atlasIndexJson}
              </pre>
              <button
                onClick={() => copyToClipboard(atlasIndexJson, false)}
                className="absolute top-2 right-2 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs flex items-center gap-1.5 transition"
              >
                {copiedIndex ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex ? "Copied Index JSON" : "Copy JSON"}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-stone-900 dark:text-white">
              <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center text-xs font-bold">3</span>
              <span>Automatic Seeding & Vector Embeddings</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 pl-8">
              Run <code>npm run seed</code> or click &ldquo;Seed Database&rdquo; in the app header. This executes Gemini&apos;s <code>text-embedding-004</code> across all gourmet recipes and embeds them directly into Atlas for semantic matching!
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition shadow-lg shadow-brand-500/20"
          >
            Got it, Let&apos;s Cook!
          </button>
        </div>
      </div>
    </div>
  );
}
