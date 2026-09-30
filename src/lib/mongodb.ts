import { MongoClient, Db, Collection } from "mongodb";
import { Recipe } from "./types";
import { INITIAL_RECIPES } from "./seed-data";

const uri = process.env.MONGODB_URI || "";
const options = {
  connectTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// In-memory fallback store for offline/demo operation when Atlas URI is not yet configured
let inMemoryRecipes: Recipe[] = [...INITIAL_RECIPES];
let inMemoryVaultIds: Set<string> = new Set(["rec_101", "rec_103"]);

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.startsWith("mongodb"));
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
    }
    return await clientPromise;
  } catch (error) {
    console.warn("MongoDB connection warning (falling back to memory mode):", error);
    return null;
  }
}

export async function getDatabase(): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  const dbName = process.env.MONGODB_DB_NAME || "pantrypro";
  return mongoClient.db(dbName);
}

export async function getRecipesCollection(): Promise<Collection<Recipe> | null> {
  const db = await getDatabase();
  if (!db) return null;
  return db.collection<Recipe>("recipes");
}

export async function getVaultCollection(): Promise<Collection<{ recipeId: string; savedAt: string }> | null> {
  const db = await getDatabase();
  if (!db) return null;
  return db.collection<{ recipeId: string; savedAt: string }>("vault");
}

// Memory fallback operations
export const memoryDb = {
  getRecipes: (filter?: { maxTime?: number; dietary?: string[]; query?: string }) => {
    let list = [...inMemoryRecipes];
    if (filter?.maxTime && filter.maxTime > 0) {
      list = list.filter((r) => r.totalTimeMinutes <= (filter.maxTime as number));
    }
    if (filter?.dietary && filter.dietary.length > 0) {
      list = list.filter((r) =>
        filter.dietary!.every((flag) => r.dietaryFlags.includes(flag as any))
      );
    }
    if (filter?.query && filter.query.trim()) {
      const q = filter.query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => ing.item.toLowerCase().includes(q)) ||
          r.flavorProfiles.some((fp) => fp.toLowerCase().includes(q)) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }
    return list.map((r) => ({
      ...r,
      savedInVault: inMemoryVaultIds.has(r._id || ""),
    }));
  },

  getRecipeById: (id: string) => {
    const r = inMemoryRecipes.find((item) => item._id === id);
    if (!r) return null;
    return {
      ...r,
      savedInVault: inMemoryVaultIds.has(r._id || ""),
    };
  },

  saveRecipe: (recipe: Recipe) => {
    const id = recipe._id || `rec_custom_${Date.now()}`;
    const newRecipe: Recipe = {
      ...recipe,
      _id: id,
      isCustom: true,
      createdAt: new Date().toISOString(),
      savedInVault: true,
    };
    inMemoryRecipes.unshift(newRecipe);
    inMemoryVaultIds.add(id);
    return newRecipe;
  },

  toggleVault: (recipeId: string) => {
    if (inMemoryVaultIds.has(recipeId)) {
      inMemoryVaultIds.delete(recipeId);
      return false;
    } else {
      inMemoryVaultIds.add(recipeId);
      return true;
    }
  },

  getVaultRecipes: () => {
    return inMemoryRecipes
      .filter((r) => inMemoryVaultIds.has(r._id || ""))
      .map((r) => ({ ...r, savedInVault: true }));
  },

  seedMemoryDb: (recipes: Recipe[]) => {
    inMemoryRecipes = [...recipes];
    return inMemoryRecipes.length;
  }
};
