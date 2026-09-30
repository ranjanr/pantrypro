import { NextRequest, NextResponse } from "next/server";
import { searchRecipesWithVector } from "@/lib/vector-search";
import { getRecipesCollection, memoryDb } from "@/lib/mongodb";
import { generateTextEmbedding } from "@/lib/gemini";
import { Recipe } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const maxTime = searchParams.get("maxTime") ? parseInt(searchParams.get("maxTime")!) : undefined;
    const dietary = searchParams.get("dietary") ? searchParams.get("dietary")!.split(",") : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20;

    const result = await searchRecipesWithVector({
      query,
      maxPrepTime: maxTime,
      dietaryFlags: dietary,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.recipes,
      count: result.recipes.length,
      isVectorSearch: result.isVectorSearch,
      fallbackMode: result.fallbackMode,
    });
  } catch (error: any) {
    console.error("API /api/recipes error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch recipes",
        data: memoryDb.getRecipes(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const recipe: Recipe = body;

    if (!recipe.title || !recipe.ingredients || recipe.ingredients.length === 0) {
      return NextResponse.json(
        { success: false, error: "Title and ingredients are required" },
        { status: 400 }
      );
    }

    // Generate vector embedding for this custom recipe
    const textForEmbedding = `${recipe.title} ${recipe.tagline} ${recipe.cuisine} ${recipe.flavorProfiles?.join(" ") || ""} ${recipe.ingredients.map(i => i.item).join(" ")}`;
    const embedding = await generateTextEmbedding(textForEmbedding);
    
    const preparedRecipe: Recipe = {
      ...recipe,
      embedding,
      isCustom: true,
      savedInVault: true,
      createdAt: new Date().toISOString(),
    };

    const collection = await getRecipesCollection();
    if (collection) {
      const insertResult = await collection.insertOne(preparedRecipe as any);
      preparedRecipe._id = insertResult.insertedId.toString();
    } else {
      memoryDb.saveRecipe(preparedRecipe);
    }

    return NextResponse.json({
      success: true,
      data: preparedRecipe,
      message: "Recipe saved to Vault successfully",
    });
  } catch (error: any) {
    console.error("API /api/recipes POST error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save recipe" },
      { status: 500 }
    );
  }
}
