import { NextRequest, NextResponse } from "next/server";
import { synthesizeRecipeFromPantry, generateTextEmbedding } from "@/lib/gemini";
import { getRecipesCollection, memoryDb } from "@/lib/mongodb";
import { Recipe } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fridgeItems, dietaryPreferences = [], maxPrepTimeMinutes = 20, cuisinePreference } = body;

    if (!fridgeItems || !Array.isArray(fridgeItems) || fridgeItems.length === 0) {
      return NextResponse.json(
        { success: false, error: "fridgeItems array is required" },
        { status: 400 }
      );
    }

    const synthesizedRecipe = await synthesizeRecipeFromPantry({
      fridgeItems,
      dietaryPreferences,
      maxPrepTimeMinutes,
      cuisinePreference,
    });

    // Generate vector embedding for this brand-new synthesized dish
    const textToEmbed = `${synthesizedRecipe.title}. ${synthesizedRecipe.tagline}. ${synthesizedRecipe.description}. Ingredients: ${synthesizedRecipe.ingredients.map(i => i.item).join(", ")}`;
    synthesizedRecipe.embedding = await generateTextEmbedding(textToEmbed);

    // Save directly to MongoDB / Memory Vault
    const collection = await getRecipesCollection();
    if (collection) {
      const insertResult = await collection.insertOne(synthesizedRecipe as any);
      synthesizedRecipe._id = insertResult.insertedId.toString();
    } else {
      memoryDb.saveRecipe(synthesizedRecipe);
    }

    return NextResponse.json({
      success: true,
      data: synthesizedRecipe,
      message: "Recipe synthesized and preserved in Vault!",
    });
  } catch (error: any) {
    console.error("AI synthesize error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to synthesize recipe" },
      { status: 500 }
    );
  }
}
