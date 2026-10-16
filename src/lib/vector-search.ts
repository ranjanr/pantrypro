import { getRecipesCollection, memoryDb } from "./mongodb";
import { generateTextEmbedding } from "./gemini";
import { INITIAL_RECIPES } from "./seed-data";
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

// Clean document for frontend transmission (strip heavy 768-dim float array & optimize image URL)
function sanitizeRecipe(r: any): Recipe {
  const { embedding, ...rest } = r;
  const rawImage: string = rest.image || "";
  const optimizedImage = rawImage.includes("images.unsplash.com")
    ? rawImage.replace(/w=\d+/g, "w=480").replace(/q=\d+/g, "q=60")
    : rawImage;
  return {
    ...rest,
    image: optimizedImage,
    _id: rest._id ? rest._id.toString() : rest._id,
  };
}

// Culinary synonym & common spelling normalization map
const CULINARY_SYNONYMS: Record<string, string[]> = {
  zucchini: ["zucchini", "zuccini", "zuchini", "courgette", "squash"],
  eggplant: ["eggplant", "aubergine", "brinjal", "baingan"],
  shrimp: ["shrimp", "prawn", "prawns"],
  paneer: ["paneer", "cottage cheese", "tofu"],
  tofu: ["tofu", "bean curd", "paneer"],
  chickpea: ["chickpea", "chickpeas", "garbanzo", "chana"],
  spinach: ["spinach", "spinch", "palak", "greens", "kale"],
  lentil: ["lentil", "lentils", "dal", "daal", "masoor", "toor"],
  yogurt: ["yogurt", "yoghurt", "curd", "dahi", "crema"],
  cilantro: ["cilantro", "coriander"],
  "bell pepper": ["bell pepper", "capsicum", "pepper", "peppers"],
  "green onion": ["green onion", "scallion", "scallions", "spring onion"],
  "coconut milk": ["coconut milk", "coconut cream", "coconut"],
  "black beans": ["black beans", "beans", "kidney beans", "pinto beans"],
  "sweet corn": ["sweet corn", "corn", "maize"],
  chili: ["chili", "chilli", "chilies", "jalapeno", "serrano", "gochujang"],
  rice: ["rice", "basmati", "jasmine", "quinoa"],
  noodles: ["noodles", "ramen", "pasta", "spaghetti", "udon"],
  mushroom: ["mushroom", "mushrooms", "shiitake", "cremini"],
  tomato: ["tomato", "tomatoes", "cherry tomatoes", "roma"],
  potato: ["potato", "potatoes", "aloo"],
  avocado: ["avocado", "avacado", "guacamole"],
  broccoli: ["broccoli", "brocoli", "cauliflower"],
  egg: ["egg", "eggs"],
  garlic: ["garlic"],
};

const STOP_WORDS = new Set([
  "the", "and", "with", "some", "leftover", "block", "half", "fresh", "canned", "chopped", "diced", "sliced", "cooked", "raw", "cup", "cups"
]);

// Compute Levenshtein edit distance for typo tolerance (e.g. "zuccini" -> "zucchini")
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b.charAt(i - 1) === a.charAt(j - 1) ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

// Parse user query into distinct ingredient phrases (e.g., ["coconut milk", "zuccini", "eggplant"])
export function parseQueryIngredients(query: string): string[] {
  const hasDelimiters = /[,;+&/]/.test(query);
  const rawParts = hasDelimiters
    ? query.split(/[,;+&/]+/)
    : query.split(/\s+/);

  const cleaned = rawParts
    .map((part) =>
      part
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w))
        .join(" ")
        .trim()
    )
    .filter((p) => p.length > 1);

  return Array.from(new Set(cleaned));
}

// Expand a user ingredient into all canonical synonyms
function expandIngredientVariants(term: string): string[] {
  const variants = new Set<string>([term]);
  const singular = term.replace(/es$/, "").replace(/s$/, "");
  if (singular.length > 2) variants.add(singular);

  for (const [canonical, list] of Object.entries(CULINARY_SYNONYMS)) {
    const matchesGroup = list.some(
      (syn) =>
        syn === term ||
        syn === singular ||
        term.includes(syn) ||
        syn.includes(term) ||
        (term.length >= 5 && syn.length >= 5 && levenshtein(term, syn) <= 2)
    );
    if (matchesGroup) {
      variants.add(canonical);
      for (const syn of list) variants.add(syn);
    }
  }
  return Array.from(variants);
}

// Check if a user ingredient matches a recipe (exact, synonym, or typo-fuzzy)
function doesIngredientMatchRecipe(userTerm: string, recipe: Recipe): { matched: boolean; inTitle: boolean; isCoreIngredient: boolean } {
  const variants = expandIngredientVariants(userTerm);
  const titleLower = (recipe.title || "").toLowerCase();
  const ingLines = (recipe.ingredients || []).map((i) => `${i.item} ${i.notes || ""}`.toLowerCase());
  const fullRecipeWords = `${titleLower} ${ingLines.join(" ")} ${(recipe.description || "").toLowerCase()}`
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);

  let matched = false;
  let inTitle = false;
  let isCoreIngredient = false;

  for (const v of variants) {
    if (titleLower.includes(v)) {
      matched = true;
      inTitle = true;
    }
    if (ingLines.some((line) => line.includes(v))) {
      matched = true;
      isCoreIngredient = true;
    }
  }

  // Typo-tolerant fallback against recipe words (e.g. "zuccini" vs "zucchini")
  if (!matched && userTerm.length >= 5) {
    const wordsToTest = userTerm.split(/\s+/).filter((w) => w.length >= 5);
    for (const w of wordsToTest) {
      for (const rw of fullRecipeWords) {
        if (Math.abs(w.length - rw.length) <= 2 && levenshtein(w, rw) <= 2) {
          matched = true;
          if (titleLower.includes(rw)) inTitle = true;
          if (ingLines.some((line) => line.includes(rw))) isCoreIngredient = true;
          break;
        }
      }
    }
  }

  return { matched, inTitle, isCoreIngredient };
}

// Score a recipe against the user's ingredient list + vector similarity
function computeHybridMatchScore(
  recipe: Recipe,
  userIngredients: string[],
  vectorSim: number
): { scorePercent: number; matchedCount: number } {
  if (userIngredients.length === 0) {
    return { scorePercent: Math.round(Math.max(0.7, vectorSim) * 100), matchedCount: 0 };
  }

  let matchedCount = 0;
  let titleHits = 0;
  let coreHits = 0;

  for (const term of userIngredients) {
    const res = doesIngredientMatchRecipe(term, recipe);
    if (res.matched) {
      matchedCount++;
      if (res.inTitle) titleHits++;
      if (res.isCoreIngredient) coreHits++;
    }
  }

  // If 0 user ingredients matched, return 0 so irrelevant dishes are filtered out
  if (matchedCount === 0) {
    return { scorePercent: 0, matchedCount: 0 };
  }

  const userCoverage = matchedCount / userIngredients.length; // 0..1
  const totalRecipeIngs = Math.max(1, (recipe.ingredients || []).length - 2); // exclude salt/oil
  const recipeCoverage = Math.min(1, coreHits / Math.min(4, totalRecipeIngs));
  const titleBonus = Math.min(0.08, titleHits * 0.04);
  const semanticBonus = Math.min(0.08, Math.max(0, vectorSim) * 0.1);

  // Calibrated intuitive culinary match curve:
  // 100% of user ingredients matched -> 88% - 98%
  // 67% (2 of 3) matched             -> 75% - 86%
  // 50% (1 of 2) matched             -> 64% - 76%
  // 33% (1 of 3) matched             -> 52% - 64%
  const rawScore =
    0.35 +
    userCoverage * 0.45 +
    recipeCoverage * 0.1 +
    titleBonus +
    semanticBonus;

  const clamped = Math.min(98, Math.max(45, Math.round(rawScore * 100)));
  return { scorePercent: clamped, matchedCount };
}

// Merge MongoDB docs with any newly added INITIAL_RECIPES so the full catalog is always searchable
function mergeWithInitialCatalog(
  dbDocs: any[],
  maxPrepTime?: number,
  dietaryFlags?: string[]
): any[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const merged: any[] = [];

  for (const doc of dbDocs) {
    const id = doc._id ? doc._id.toString() : "";
    const title = (doc.title || "").toLowerCase();
    if (id) seenIds.add(id);
    if (title) seenTitles.add(title);
    merged.push(doc);
  }

  for (const seed of INITIAL_RECIPES) {
    const id = seed._id || "";
    const title = seed.title.toLowerCase();
    if (seenIds.has(id) || seenTitles.has(title)) continue;
    if (maxPrepTime && maxPrepTime > 0 && seed.totalTimeMinutes > maxPrepTime) continue;
    if (
      dietaryFlags &&
      dietaryFlags.length > 0 &&
      !dietaryFlags.every((flag) => seed.dietaryFlags.includes(flag as any))
    ) {
      continue;
    }
    merged.push(seed);
  }

  return merged;
}

export async function searchRecipesWithVector({
  query,
  maxPrepTime,
  dietaryFlags,
  limit = 6,
}: {
  query?: string;
  maxPrepTime?: number;
  dietaryFlags?: string[];
  limit?: number;
}): Promise<{ recipes: Recipe[]; isVectorSearch: boolean; fallbackMode: boolean; queryTokens?: string[] }> {
  const collection = await getRecipesCollection();
  const userIngredients = query && query.trim() ? parseQueryIngredients(query) : [];

  // In-Memory or Fallback Mode
  if (!collection) {
    const recipes = memoryDb.getRecipes({
      maxTime: maxPrepTime,
      dietary: dietaryFlags,
    });

    if (userIngredients.length > 0 && query) {
      const queryVec = await generateTextEmbedding(query);

      const scored = await Promise.all(
        recipes.map(async (recipe) => {
          let recVec = recipe.embedding;
          if (!recVec || recVec.length === 0) {
            recVec = await generateTextEmbedding(
              `${recipe.title} ${recipe.cuisine} ${recipe.flavorProfiles.join(" ")} ${recipe.ingredients.map((i) => i.item).join(" ")}`
            );
          }
          const baseSim = cosineSimilarity(queryVec, recVec);
          const { scorePercent, matchedCount } = computeHybridMatchScore(
            recipe,
            userIngredients,
            baseSim
          );

          return {
            recipe: {
              ...sanitizeRecipe(recipe),
              vectorScore: scorePercent,
            },
            matchedCount,
            scorePercent,
          };
        })
      );

      const relevant = scored
        .filter((item) => item.matchedCount > 0 && item.scorePercent >= 45)
        .sort((a, b) =>
          b.matchedCount !== a.matchedCount
            ? b.matchedCount - a.matchedCount
            : b.scorePercent - a.scorePercent
        )
        .map((item) => item.recipe);

      return {
        recipes: relevant.slice(0, limit),
        isVectorSearch: true,
        fallbackMode: true,
        queryTokens: userIngredients,
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
    const mongoFilter: any = {};
    if (maxPrepTime && maxPrepTime > 0) mongoFilter.totalTimeMinutes = { $lte: maxPrepTime };
    if (dietaryFlags && dietaryFlags.length > 0) mongoFilter.dietaryFlags = { $all: dietaryFlags };

    if (userIngredients.length > 0 && query) {
      const queryVec = await generateTextEmbedding(query);

      let results: any[] = [];
      try {
        const pipeline: any[] = [
          {
            $vectorSearch: {
              index: "vector_index",
              path: "embedding",
              queryVector: queryVec,
              numCandidates: 100,
              limit: 50,
              ...(Object.keys(mongoFilter).length > 0 ? { filter: mongoFilter } : {}),
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
        const cursor = collection.aggregate<any>(pipeline);
        results = await cursor.toArray();
      } catch (vectorErr) {
        console.warn("Atlas $vectorSearch warning, using collection find + hybrid ranking:", vectorErr);
      }

      if (!results || results.length === 0) {
        results = await collection.find(mongoFilter).limit(50).toArray();
      }

      // Combine Atlas results with any newly added INITIAL_RECIPES so the expanded catalog always matches
      const candidatePool = mergeWithInitialCatalog(results, maxPrepTime, dietaryFlags);

      const scored = candidatePool.map((r: any) => {
        const rawSim =
          typeof r.score === "number"
            ? r.score
            : r.embedding
            ? cosineSimilarity(queryVec, r.embedding)
            : 0.6;

        const { scorePercent, matchedCount } = computeHybridMatchScore(
          r,
          userIngredients,
          rawSim
        );

        return {
          recipe: {
            ...sanitizeRecipe(r),
            vectorScore: scorePercent,
          },
          matchedCount,
          scorePercent,
        };
      });

      const relevant = scored
        .filter((item) => item.matchedCount > 0 && item.scorePercent >= 45)
        .sort((a, b) =>
          b.matchedCount !== a.matchedCount
            ? b.matchedCount - a.matchedCount
            : b.scorePercent - a.scorePercent
        )
        .map((item) => item.recipe);

      return {
        recipes: relevant.slice(0, limit),
        isVectorSearch: true,
        fallbackMode: false,
        queryTokens: userIngredients,
      };
    } else {
      const rawDocs = await collection.find(mongoFilter).limit(limit).toArray();
      const merged = mergeWithInitialCatalog(rawDocs, maxPrepTime, dietaryFlags);
      const recipes: Recipe[] = merged.slice(0, limit).map(sanitizeRecipe);
      return { recipes, isVectorSearch: false, fallbackMode: false };
    }
  } catch (err) {
    console.error("MongoDB query error:", err);
    return {
      recipes: memoryDb.getRecipes({ maxTime: maxPrepTime, dietary: dietaryFlags, query }).slice(0, limit).map(sanitizeRecipe),
      isVectorSearch: false,
      fallbackMode: true,
    };
  }
}

