import { NextResponse } from "next/server";
import { getMongoClient, isMongoConfigured } from "@/lib/mongodb";
import { isGeminiConfigured } from "@/lib/gemini";

export async function GET() {
  const mongoConfigured = isMongoConfigured();
  let mongoConnected = false;

  if (mongoConfigured) {
    try {
      const client = await getMongoClient();
      if (client) {
        await client.db("admin").command({ ping: 1 });
        mongoConnected = true;
      }
    } catch (e) {
      mongoConnected = false;
    }
  }

  const geminiConfigured = isGeminiConfigured();

  return NextResponse.json({
    success: true,
    mongo: {
      configured: mongoConfigured,
      connected: mongoConnected,
      mode: mongoConnected ? "Atlas Production Cluster" : "Resilient In-Memory Vector Store",
    },
    gemini: {
      configured: geminiConfigured,
      model: "gemini-2.5-pro & text-embedding-004",
      mode: geminiConfigured ? "Live Gemini AI Engine" : "Simulated Pro Chef Engine (Offline Ready)",
    },
    timestamp: new Date().toISOString(),
  });
}
