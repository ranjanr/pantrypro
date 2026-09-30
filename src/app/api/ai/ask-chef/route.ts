import { NextRequest, NextResponse } from "next/server";
import { askChefQuestion } from "@/lib/gemini";
import { ChefPersonaType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeTitle, recipeIngredients = [], question, personaType } = body as {
      recipeTitle: string;
      recipeIngredients: string[];
      question: string;
      personaType?: ChefPersonaType;
    };

    if (!recipeTitle || !question) {
      return NextResponse.json(
        { success: false, error: "recipeTitle and question are required" },
        { status: 400 }
      );
    }

    const answer = await askChefQuestion({
      recipeTitle,
      recipeIngredients,
      question,
      personaType,
    });

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: any) {
    console.error("Ask chef error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get chef advice" },
      { status: 500 }
    );
  }
}
