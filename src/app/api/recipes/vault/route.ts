import { NextRequest, NextResponse } from "next/server";
import { getVaultCollection, getRecipesCollection, memoryDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { Recipe } from "@/lib/types";

export async function GET() {
  try {
    const vaultCollection = await getVaultCollection();
    const recipesCollection = await getRecipesCollection();

    if (vaultCollection && recipesCollection) {
      const vaultItems = await vaultCollection.find().toArray();
      const ids = vaultItems.map((item) => {
        return ObjectId.isValid(item.recipeId) ? new ObjectId(item.recipeId) : item.recipeId;
      });

      const recipes = await recipesCollection.find({ _id: { $in: ids as any } }).toArray();
      const formatted: Recipe[] = recipes.map((r: any) => ({
        ...r,
        _id: r._id.toString(),
        savedInVault: true,
      }));

      return NextResponse.json({
        success: true,
        data: formatted,
        count: formatted.length,
      });
    }

    const fallbackVault = memoryDb.getVaultRecipes();
    return NextResponse.json({
      success: true,
      data: fallbackVault,
      count: fallbackVault.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipeId } = body;

    if (!recipeId) {
      return NextResponse.json(
        { success: false, error: "recipeId is required" },
        { status: 400 }
      );
    }

    const vaultCollection = await getVaultCollection();
    if (vaultCollection) {
      const existing = await vaultCollection.findOne({ recipeId });
      if (existing) {
        await vaultCollection.deleteOne({ recipeId });
        return NextResponse.json({
          success: true,
          saved: false,
          message: "Removed from Vault",
        });
      } else {
        await vaultCollection.insertOne({
          recipeId,
          savedAt: new Date().toISOString(),
        });
        return NextResponse.json({
          success: true,
          saved: true,
          message: "Saved to Vault",
        });
      }
    }

    const saved = memoryDb.toggleVault(recipeId);
    return NextResponse.json({
      success: true,
      saved,
      message: saved ? "Saved to Vault" : "Removed from Vault",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
