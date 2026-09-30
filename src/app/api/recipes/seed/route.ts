import { NextResponse } from "next/server";
import { getRecipesCollection, memoryDb } from "@/lib/mongodb";
import { INITIAL_RECIPES } from "@/lib/seed-data";
import { generateTextEmbedding } from "@/lib/gemini";
import { Recipe } from "@/lib/types";

export async function POST() {
  try {
    const collection = await getRecipesCollection();

    // Enrich seed recipes with vector embeddings
    const enrichedRecipes: Recipe[] = await Promise.all(
      INITIAL_RECIPES.map(async (recipe) => {
        const textToEmbed = `${recipe.title}. ${recipe.tagline}. ${recipe.description}. Cuisine: ${recipe.cuisine}. Flavors: ${recipe.flavorProfiles.join(", ")}. Ingredients: ${recipe.ingredients.map(i => `${i.amount} ${i.item}`).join(", ")}.`;
        const embedding = await generateTextEmbedding(textToEmbed);
        return {
          ...recipe,
          embedding,
          createdAt: new Date().toISOString(),
        };
      })
    );

    if (collection) {
      // Clear existing default recipes and re-insert
      await collection.deleteMany({ isCustom: { $ne: true } });
      const insertResult = await collection.insertMany(enrichedRecipes as any);

      return NextResponse.json({
        success: true,
        message: `Successfully seeded ${insertResult.insertedCount} recipes with vector embeddings into MongoDB Atlas!`,
        count: insertResult.insertedCount,
      });
    }

    // In-memory update
    memoryDb.seedMemoryDb(enrichedRecipes);
    return NextResponse.json({
      success: true,
      message: `Database connected in memory mode: Seeded ${enrichedRecipes.length} recipes with simulated embeddings.`,
      count: enrichedRecipes.length,
      fallbackMode: true,
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
