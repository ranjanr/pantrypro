import { getRecipesCollection, memoryDb } from "./mongodb";
import { generateTextEmbedding } from "./gemini";
import { Recipe } from "./types";

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Clean document for frontend transmission (strip heavy 768-dim float array)
function sanitizeRecipe(r: any): Recipe {
  const { embedding, ...rest } = r;
  return {
    ...rest,
    _id: rest._id ? rest._id.toString() : rest._id,
  };
}

// Extract keywords from user query
function extractTokens(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s,;+&]+/)
    .map((t) => t.trim().replace(/[^a-z0-9]/g, ""))
    .filter((t) => t.length > 2 && !["the", "and", "with", "some", "leftover", "block", "half"].includes(t));
}

export async function searchRecipesWithVector({
  query,
  maxPrepTime,
  dietaryFlags,
  limit = 12,
}: {
  query?: string;
  maxPrepTime?: number;
  dietaryFlags?: string[];
  limit?: number;
}): Promise<{ recipes: Recipe[]; isVectorSearch: boolean; fallbackMode: boolean; queryTokens?: string[] }> {
  const collection = await getRecipesCollection();
  const tokens = query ? extractTokens(query) : [];

  // In-Memory or Fallback Mode
  if (!collection) {
    let recipes = memoryDb.getRecipes({
      maxTime: maxPrepTime,
      dietary: dietaryFlags,
    });

    if (query && query.trim()) {
      const queryVec = await generateTextEmbedding(query);

      const scored = await Promise.all(
        recipes.map(async (recipe) => {
          let recVec = recipe.embedding;
          if (!recVec || recVec.length === 0) {
            recVec = await generateTextEmbedding(
              `${recipe.title} ${recipe.cuisine} ${recipe.flavorProfiles.join(" ")} ${recipe.ingredients.map(i => i.item).join(" ")}`
            );
          }
          const baseSim = cosineSimilarity(queryVec, recVec);
          
          const ingText = recipe.ingredients.map((i) => i.item.toLowerCase()).join(" ");
          const titleText = recipe.title.toLowerCase();
          const tagText = `${recipe.cuisine} ${recipe.flavorProfiles.join(" ")}`.toLowerCase();

          let tokenMatches = 0;
          for (const token of tokens) {
            if (ingText.includes(token) || titleText.includes(token) || tagText.includes(token)) {
              tokenMatches++;
            }
          }

          const tokenRatio = tokens.length > 0 ? tokenMatches / tokens.length : 0;
          const finalScore = Math.min(0.99, baseSim * 0.45 + tokenRatio * 0.55);

          return {
            ...sanitizeRecipe(recipe),
            vectorScore: Math.round(finalScore * 100),
          };
        })
      );

      scored.sort((a, b) => (b.vectorScore || 0) - (a.vectorScore || 0));

      return {
        recipes: scored.slice(0, limit),
        isVectorSearch: true,
        fallbackMode: true,
        queryTokens: tokens,
      };
    }

    return {
      recipes: recipes.slice(0, limit).map(sanitizeRecipe),
      isVectorSearch: false,
      fallbackMode: true,
    };
  }

  // MongoDB Atlas Active Mode
  try {
    if (query && query.trim()) {
      const queryVec = await generateTextEmbedding(query);

      const filterObj: Record<string, any> = {};
      if (maxPrepTime && maxPrepTime > 0) {
        filterObj.totalTimeMinutes = { $lte: maxPrepTime };
      }
      if (dietaryFlags && dietaryFlags.length > 0) {
        filterObj.dietaryFlags = { $all: dietaryFlags };
      }

      const pipeline: any[] = [
        {
          $vectorSearch: {
            index: "vector_index",
            path: "embedding",
            queryVector: queryVec,
            numCandidates: 100,
            limit: 50,
            ...(Object.keys(filterObj).length > 0 ? { filter: filterObj } : {}),
          },
        },
        {
          $project: {
            _id: { $toString: "$_id" },
            title: 1,
            tagline: 1,
            description: 1,
            prepTimeMinutes: 1,
            cookTimeMinutes: 1,
            totalTimeMinutes: 1,
            difficulty: 1,
            servings: 1,
            cuisine: 1,
            flavorProfiles: 1,
            dietaryFlags: 1,
            ingredients: 1,
            instructions: 1,
            proChefTips: 1,
            macros: 1,
            image: 1,
            isCustom: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ];

      let results: any[] = [];
      try {
        const cursor = collection.aggregate<any>(pipeline);
        results = await cursor.toArray();
      } catch (vectorErr) {
        console.warn("Atlas $vectorSearch warning, using collection find + cosine ranking:", vectorErr);
      }

      if (results && results.length > 0) {
        const enriched = results.map((r: any) => {
          const rawScore = typeof r.score === "number" ? r.score : 0.6;
          const ingText = r.ingredients?.map((i: any) => i.item.toLowerCase()).join(" ") || "";
          const titleText = (r.title || "").toLowerCase();

          let tokenMatches = 0;
          for (const token of tokens) {
            if (ingText.includes(token) || titleText.includes(token)) {
              tokenMatches++;
            }
          }

          const tokenRatio = tokens.length > 0 ? tokenMatches / tokens.length : 0;
          const combined = Math.min(0.99, rawScore * 0.4 + tokenRatio * 0.6);

          return {
            ...sanitizeRecipe(r),
            vectorScore: Math.round(combined * 100),
          };
        });

        enriched.sort((a: any, b: any) => (b.vectorScore || 0) - (a.vectorScore || 0));

        return {
          recipes: enriched.slice(0, limit),
          isVectorSearch: true,
          fallbackMode: false,
          queryTokens: tokens,
        };
      }

      // Fallback query across collection
      const mongoFilter: any = {};
      if (maxPrepTime && maxPrepTime > 0) mongoFilter.totalTimeMinutes = { $lte: maxPrepTime };
      if (dietaryFlags && dietaryFlags.length > 0) mongoFilter.dietaryFlags = { $all: dietaryFlags };

      const rawDocs = await collection.find(mongoFilter).limit(50).toArray();

      const scored = rawDocs.map((r: any) => {
        const baseSim = r.embedding ? cosineSimilarity(queryVec, r.embedding) : 0.5;
        const ingText = (r.ingredients || []).map((i: any) => i.item.toLowerCase()).join(" ");
        const titleText = (r.title || "").toLowerCase();

        let tokenMatches = 0;
        for (const token of tokens) {
          if (ingText.includes(token) || titleText.includes(token)) tokenMatches++;
        }

        const tokenRatio = tokens.length > 0 ? tokenMatches / tokens.length : 0;
        const finalScore = Math.min(0.99, baseSim * 0.45 + tokenRatio * 0.55);

        return {
          ...sanitizeRecipe(r),
          vectorScore: Math.round(finalScore * 100),
        };
      });

      scored.sort((a, b) => (b.vectorScore || 0) - (a.vectorScore || 0));

      return {
        recipes: scored.slice(0, limit),
        isVectorSearch: true,
        fallbackMode: false,
        queryTokens: tokens,
      };
    } else {
      // General list
      const mongoFilter: any = {};
      if (maxPrepTime && maxPrepTime > 0) mongoFilter.totalTimeMinutes = { $lte: maxPrepTime };
      if (dietaryFlags && dietaryFlags.length > 0) mongoFilter.dietaryFlags = { $all: dietaryFlags };

      const rawDocs = await collection.find(mongoFilter).limit(limit).toArray();
      const recipes: Recipe[] = rawDocs.map(sanitizeRecipe);
      return { recipes, isVectorSearch: false, fallbackMode: false };
    }
  } catch (err) {
    console.error("MongoDB query error:", err);
    return {
      recipes: memoryDb.getRecipes({ maxTime: maxPrepTime, dietary: dietaryFlags, query }).map(sanitizeRecipe),
      isVectorSearch: false,
      fallbackMode: true,
    };
  }
}
