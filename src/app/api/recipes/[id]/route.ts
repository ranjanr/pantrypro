import { NextRequest, NextResponse } from "next/server";
import { getRecipesCollection, memoryDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await getRecipesCollection();

    if (collection) {
      let doc = null;
      if (ObjectId.isValid(id)) {
        doc = await collection.findOne({ _id: new ObjectId(id) as any });
      }
      if (!doc) {
        doc = await collection.findOne({ _id: id as any });
      }

      if (doc) {
        return NextResponse.json({
          success: true,
          data: { ...doc, _id: doc._id.toString() },
        });
      }
    }

    const memoryDoc = memoryDb.getRecipeById(id);
    if (memoryDoc) {
      return NextResponse.json({ success: true, data: memoryDoc });
    }

    return NextResponse.json(
      { success: false, error: "Recipe not found" },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
