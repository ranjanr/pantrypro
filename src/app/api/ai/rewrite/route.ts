import { NextRequest, NextResponse } from "next/server";
import { rewriteRecipeWithPersona } from "@/lib/gemini";
import { ChefPersonaType, Recipe } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipe, persona } = body as { recipe: Recipe; persona: ChefPersonaType };

    if (!recipe || !persona) {
      return NextResponse.json(
        { success: false, error: "Recipe and persona are required" },
        { status: 400 }
      );
    }

    const rewritten = await rewriteRecipeWithPersona(recipe, persona);

    return NextResponse.json({
      success: true,
      data: rewritten,
    });
  } catch (error: any) {
    console.error("AI rewrite error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to rewrite recipe" },
      { status: 500 }
    );
  }
}
