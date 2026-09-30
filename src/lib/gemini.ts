import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChefPersonaType, Recipe, RewrittenRecipeResponse, Ingredient } from "./types";
import { CHEF_PERSONAS } from "./seed-data";

const apiKey = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export function isGeminiConfigured(): boolean {
  return Boolean(apiKey && apiKey.length > 5);
}

// Generate Embedding for Vector Search
export async function generateTextEmbedding(text: string): Promise<number[]> {
  if (!genAI || !apiKey) {
    return generateSimulatedEmbedding(text);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.warn("Gemini embedding error, using simulated vector:", error);
    return generateSimulatedEmbedding(text);
  }
}

// Deterministic 768-dimensional normalized simulated embedding for offline/testing mode
export function generateSimulatedEmbedding(text: string): number[] {
  const dim = 768;
  const vector = new Array(dim).fill(0);
  const normalized = text.toLowerCase().trim();
  
  for (let i = 0; i < normalized.length; i++) {
    const charCode = normalized.charCodeAt(i);
    const idx1 = (charCode * 17 + i * 31) % dim;
    const idx2 = (charCode * 43 + i * 7) % dim;
    vector[idx1] += 0.35;
    vector[idx2] += 0.25;
  }
  
  // Normalize vector to unit length
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vector.map((v) => v / magnitude);
}

// Dynamic Pro Chef Rewriter using Gemini
export async function rewriteRecipeWithPersona(
  recipe: Recipe,
  personaType: ChefPersonaType
): Promise<RewrittenRecipeResponse> {
  const persona = CHEF_PERSONAS.find((p) => p.id === personaType) || CHEF_PERSONAS[0];

  if (!genAI || !apiKey) {
    return getSimulatedPersonaRewrite(recipe, personaType);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = `You are ${persona.name} (${persona.subtitle}). Focus: ${persona.focus}.
Transform and dynamically elevate the following recipe instructions using your signature pro-chef technique.

Original Recipe:
Title: "${recipe.title}"
Cuisine: "${recipe.cuisine}"
Prep Time: ${recipe.prepTimeMinutes} mins, Cook Time: ${recipe.cookTimeMinutes} mins
Ingredients: ${JSON.stringify(recipe.ingredients)}
Current Instructions: ${JSON.stringify(recipe.instructions)}

Requirements:
1. Revise each step to include specific pro-level techniques (e.g. pan temperature indicators, Maillard reaction queues, blooming spices, emulsification techniques, resting durations, and acidity adjustments with lime/vinegar).
2. Maintain the same general step count and core ingredients, but elevate the culinary execution and speed.
3. Provide targeted secrets for:
   - Heat Control (flame intensity, pan surface cues)
   - Acidity & Brighteners (when to introduce lemon/lime/vinegar/sumac to slice through fat)
   - Textural Contrast (crispy bits, emulsions, herb additions)
   - Resting & Finishing (oil drizzles, salt flakes, temperature stabilization)
4. Return valid JSON matching this schema:
{
  "originalTitle": "${recipe.title}",
  "persona": "${personaType}",
  "enhancedTagline": "Punchy elevated tagline reflecting ${persona.name}'s touch",
  "revisedInstructions": [
    {
      "stepNumber": 1,
      "instruction": "Detailed elevated instruction with sensory cues",
      "chefTip": "Pro-tip from ${persona.name}",
      "durationMinutes": 2
    }
  ],
  "proSecrets": {
    "heatControl": "Crucial temperature wisdom",
    "acidityAndBrighteners": "Acid timing instruction",
    "texturalContrast": "Crispy/crunch contrast advice",
    "restingAndFinishing": "Resting and garnish technique"
  },
  "suggestedPantrySwaps": [
    { "original": "Ingredient name", "swap": "Alternative", "rationale": "Why it elevates or substitutes cleanly" }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text) as RewrittenRecipeResponse;
  } catch (error) {
    console.warn("Gemini rewrite fallback triggered:", error);
    // Fallback model trial or simulated
    try {
      const flashModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });
      const res = await flashModel.generateContent(`Revise recipe "${recipe.title}" as Chef ${persona.name}. Return JSON with originalTitle, persona, enhancedTagline, revisedInstructions, proSecrets, suggestedPantrySwaps.`);
      return JSON.parse(res.response.text());
    } catch {
      return getSimulatedPersonaRewrite(recipe, personaType);
    }
  }
}

// Fallback Simulated Persona Rewrites
function getSimulatedPersonaRewrite(recipe: Recipe, personaType: ChefPersonaType): RewrittenRecipeResponse {
  switch (personaType) {
    case "michelin_pro":
      return {
        originalTitle: recipe.title,
        persona: personaType,
        enhancedTagline: `Michelin Masterclass: Precision temperature control & deglazed pan sauce reduction.`,
        revisedInstructions: recipe.instructions.map((step) => ({
          ...step,
          instruction: `${step.instruction} Ensure your pan reaches the Leidenfrost point before introducing fats. Listen for a steady hiss rather than aggressive sputtering.`,
          chefTip: `Deglaze with a teaspoon of dry white wine or citrus acid to lift fond from the pan bottom and incorporate micro-caramelized sugars into your emulsion.`,
        })),
        proSecrets: {
          heatControl: "Preheat stainless steel until water droplets dance without evaporating. Lower flame immediately upon adding delicate aromatics.",
          acidityAndBrighteners: "Introduce 3 drops of high-grade aged vinegar or lemon juice off-heat so volatile floral aromatics do not burn away.",
          texturalContrast: "Incorporate toasted crushed nuts or flashed herb leaves right at the plating stage for immediate auditory crunch.",
          restingAndFinishing: "Allow a mandatory 90-second rest in a warm zone for internal moisture distribution and velvet gloss."
        },
        suggestedPantrySwaps: [
          { original: "Oil", swap: "Clarified Brown Butter (Ghee)", rationale: "Higher smoke point + rich nutty toasted milk solids." },
          { original: "Table Salt", swap: "Maldon Flaky Sea Salt", rationale: "Delivers pleasant salinity crunch without over-salting the core." }
        ]
      };

    case "desi_modernist":
      return {
        originalTitle: recipe.title,
        persona: personaType,
        enhancedTagline: `Desi Modernist: Whole spice tempering, tadka aromatics & zesty lime balance.`,
        revisedInstructions: recipe.instructions.map((step) => ({
          ...step,
          instruction: `${step.instruction} Bloom your whole spices in hot fat until they crackle and release their essential terpene oils before adding onions.`,
          chefTip: `Rub kasuri methi or crushed coriander between your palms to rupture the essential oil cells right over the skillet.`,
        })),
        proSecrets: {
          heatControl: "Flash-fry spices in smoking hot ghee for 12 seconds max, then instantly drop aromatics to prevent scorching.",
          acidityAndBrighteners: "A squeeze of fresh key lime and a pinch of Amchur (dry mango powder) brings sharp tang without extra liquid.",
          texturalContrast: "Crispy fried curry leaves and blistered serrano chilies sprinkled on top.",
          restingAndFinishing: "Cover the pan for 60 seconds immediately following the hot tadka pour to infuse the volatile smoke."
        },
        suggestedPantrySwaps: [
          { original: "Butter", swap: "Grass-fed Desi Ghee", rationale: "Nutty depth and 485°F smoke point for immaculate searing." },
          { original: "Vinegar", swap: "Fresh Lime + Chaat Masala", rationale: "Adds sulfurous black salt notes and high-octane citrus brightness." }
        ]
      };

    case "weeknight_hustle":
      return {
        originalTitle: recipe.title,
        persona: personaType,
        enhancedTagline: `10-Minute Hustle: Zero wasted motion, one-pan efficiency & maximal flavor yield.`,
        revisedInstructions: recipe.instructions.map((step) => ({
          ...step,
          instruction: `${step.instruction} Keep heat aggressive on high. Use the back of your spoon or spatula to smash ingredients against the pan wall to accelerate cooking time by 40%.`,
          chefTip: `No need to chop meticulously—rustic coarse cuts caramelize faster on high surface heat!`,
        })),
        proSecrets: {
          heatControl: "Keep flame on medium-high to evaporate moisture rapidly and achieve quick browning.",
          acidityAndBrighteners: "A splash of pickle juice or lemon from the fridge door instantly wakes up tired canned items.",
          texturalContrast: "Crushed potato chips, toasted seeds, or crispy onions out of the tub for 0-effort crunch.",
          restingAndFinishing: "Direct from pan to bowl—steam is flavor in quick-style cooking."
        },
        suggestedPantrySwaps: [
          { original: "Fresh Garlic", swap: "Garlic Confit / Garlic Paste", rationale: "Instant caramel notes without 5 minutes of peeling and mincing." }
        ]
      };

    case "street_food_alchemist":
      return {
        originalTitle: recipe.title,
        persona: personaType,
        enhancedTagline: `Street Food Lab: High-octane wok sear, smoky char & savory umami glaze.`,
        revisedInstructions: recipe.instructions.map((step) => ({
          ...step,
          instruction: `${step.instruction} Press the ingredients against the smoking pan rim to get that distinctive charcoal street-cart char ('wok hei').`,
          chefTip: `Drizzle sauces around the red-hot outer edge of the pan so they sizzle and caramelize before touching the food.`,
        })),
        proSecrets: {
          heatControl: "Screaming hot pan; cook in swift batches rather than crowding.",
          acidityAndBrighteners: "Chinkiang black vinegar or spicy lime-chili drizzle to cut through the char.",
          texturalContrast: "Fried shallots, crushed peanuts, and scallion curls.",
          restingAndFinishing: "Toss twice in the air and serve immediately while the exterior is crackling hot."
        },
        suggestedPantrySwaps: [
          { original: "Soy Sauce", swap: "Dark Soy + Touch of Honey", rationale: "Glossy lacquer finish and deeper umami depth." }
        ]
      };

    case "scientific_culinarian":
    default:
      return {
        originalTitle: recipe.title,
        persona: personaType,
        enhancedTagline: `Food Science Lab: Optimizing Maillard browning, pH stabilization & moisture retention.`,
        revisedInstructions: recipe.instructions.map((step) => ({
          ...step,
          instruction: `${step.instruction} Pay attention to the thermal transition zone (140°C - 165°C) where reducing sugars and amino acids combine into hundreds of new flavor compounds.`,
          chefTip: `Maintain surface dryness before searing to prevent boiling and maximize the rate of the Maillard reaction.`,
        })),
        proSecrets: {
          heatControl: "Maintain skillet surface temperature at 155°C (310°F) for peak Maillard kinetics without pyrolytic bitterness.",
          acidityAndBrighteners: "Acid reduces the rate of enzymatic browning and strengthens pectin; add towards the end to preserve vegetable crunch.",
          texturalContrast: "Combine hydrocolloid starch gelatinization with dehydrated crispy elements.",
          restingAndFinishing: "Capillary action equalizes internal pressure and moisture during a 2-minute delta-t rest."
        },
        suggestedPantrySwaps: [
          { original: "Standard Oil", swap: "Avocado Oil + Touch of Butter", rationale: "High smoke point base + diacetyl butter aromatics." }
        ]
      };
  }
}

// AI Recipe Synthesis from Pantry Ingredients
export async function synthesizeRecipeFromPantry(params: {
  fridgeItems: string[];
  dietaryPreferences: string[];
  maxPrepTimeMinutes: number;
  cuisinePreference?: string;
}): Promise<Recipe> {
  const ingredientsStr = params.fridgeItems.join(", ");
  const dietaryStr = params.dietaryPreferences.length > 0 ? params.dietaryPreferences.join(", ") : "None specified";
  const maxTime = params.maxPrepTimeMinutes || 20;
  const cuisine = params.cuisinePreference || "Modern Global Fusion";

  if (!genAI || !apiKey) {
    return generateFallbackSynthesizedRecipe(params);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const prompt = `You are an elite master chef specializing in ultra-fast, high-yield gourmet cooking for busy professionals and students.
Create a complete, innovative, delicious recipe using these exact ingredients found in the user's fridge/pantry:
Ingredients available: ${ingredientsStr}
Dietary constraints: ${dietaryStr}
Max Total Time: ${maxTime} minutes
Preferred Cuisine style: ${cuisine}

Requirements:
1. Make it ultra-practical, rapid (< ${maxTime} mins total), and culinary-grade (with pro chef tips on heat control, acidity balance, and resting).
2. Format as a valid JSON Recipe object with these exact fields:
{
  "title": "Creative Appetizing Title",
  "tagline": "Short punchy description highlighting flavor and speed",
  "description": "2-3 sentences explaining the dish and textures",
  "prepTimeMinutes": number,
  "cookTimeMinutes": number,
  "totalTimeMinutes": number,
  "difficulty": "Ultra-Fast (10m)" | "Quick (20m)" | "Balanced (30m)",
  "servings": number,
  "cuisine": "${cuisine}",
  "flavorProfiles": ["Spicy", "Umami-rich", etc],
  "dietaryFlags": ["Vegetarian", "Vegan", "Eggless", "Gluten-Free", "High-Protein"],
  "ingredients": [
    { "item": "name", "amount": "quantity", "notes": "optional note" }
  ],
  "instructions": [
    {
      "stepNumber": 1,
      "instruction": "clear action",
      "chefTip": "expert tip on heat or flavor",
      "durationMinutes": 3
    }
  ],
  "proChefTips": {
    "heatControl": "Tip on pan heat and timing",
    "acidityBalance": "How to use lime/lemon/vinegar to balance richness",
    "restingTime": "Resting recommendation",
    "flavorBooster": "Secret pantry finisher"
  },
  "macros": {
    "calories": 420,
    "proteinGrams": 22,
    "carbsGrams": 40,
    "fatGrams": 18
  },
  "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
}`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text()) as Recipe;
    return {
      ...parsed,
      _id: `rec_ai_${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString(),
      savedInVault: true,
    };
  } catch (error) {
    console.warn("Gemini recipe synthesis fallback:", error);
    return generateFallbackSynthesizedRecipe(params);
  }
}

function generateFallbackSynthesizedRecipe(params: {
  fridgeItems: string[];
  dietaryPreferences: string[];
  maxPrepTimeMinutes: number;
  cuisinePreference?: string;
}): Recipe {
  const items = params.fridgeItems.length > 0 ? params.fridgeItems : ["Paneer", "Spinach", "Leftover Rice"];
  const title = `Speedy ${items.slice(0, 2).join(" & ")} Pantry Sauté`;
  
  return {
    _id: `rec_ai_${Date.now()}`,
    title,
    tagline: `Rapid ${params.maxPrepTimeMinutes || 15}-minute pantry turnaround using ${items.join(", ")}.`,
    description: `A fast, high-yield gourmet skillet combining your available ingredients with aromatic bloom, golden crisp edges, and a bright citrus finish.`,
    prepTimeMinutes: 4,
    cookTimeMinutes: Math.min(params.maxPrepTimeMinutes || 12, 10),
    totalTimeMinutes: Math.min(params.maxPrepTimeMinutes || 15, 14),
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: params.cuisinePreference || "Global Pantry Fusion",
    flavorProfiles: ["Umami-rich", "Zesty & Tangy", "Comforting"],
    dietaryFlags: (params.dietaryPreferences.length > 0 ? params.dietaryPreferences : ["Vegetarian", "Eggless", "High-Protein"]) as any,
    ingredients: [
      ...items.map((item, idx): Ingredient => ({
        item: item,
        amount: idx === 0 ? "1.5 cups" : idx === 1 ? "1 cup" : "1/2 cup",
        notes: "Prepared and ready to toss",
      })),
      { item: "Cooking Oil or Butter", amount: "1.5 tbsp" },
      { item: "Garlic or Spices of choice", amount: "1 tsp" },
      { item: "Fresh Lime or Lemon juice", amount: "1 tbsp", notes: "For finishing acidity" },
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: `Heat skillet over medium-high heat. Add oil and toss in your primary hearty items (${items[0]}) to get golden brown crispy edges.`,
        chefTip: "Do not crowd the pan; surface space ensures crispy searing rather than watery steaming.",
        durationMinutes: 3
      },
      {
        stepNumber: 2,
        instruction: `Add secondary ingredients (${items.slice(1).join(", ") || "greens and aromatics"}). Stir vigorously for 2-3 minutes until heated through.`,
        chefTip: "Layer aromatics in the middle to bloom flavor compounds in hot fat.",
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        instruction: `Turn off heat. Drizzle with fresh lime juice, flaky salt, and freshly cracked black pepper.`,
        chefTip: "Acidity cuts directly through the fat and brings the dish into razor-sharp focus.",
        durationMinutes: 1
      }
    ],
    proChefTips: {
      heatControl: "Keep skillet at medium-high to get instant golden Maillard caramelization.",
      acidityBalance: "Always finish with a splash of citrus or vinegar off heat to preserve brightness.",
      restingTime: "Serve straight away while steaming hot.",
      flavorBooster: "Toasted sesame seeds, chili crisp, or crushed herbs."
    },
    macros: {
      calories: 390,
      proteinGrams: 20,
      carbsGrams: 36,
      fatGrams: 16
    },
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    isCustom: true,
    createdAt: new Date().toISOString(),
    savedInVault: true,
  };
}

// Live Interactive AI Chef Assistant
export async function askChefQuestion(params: {
  recipeTitle: string;
  recipeIngredients: string[];
  question: string;
  personaType?: ChefPersonaType;
}): Promise<string> {
  if (!genAI || !apiKey) {
    return `Chef Tip: If you're missing an ingredient or need to balance the flavor in "${params.recipeTitle}", focus on the fundamental triumvirate: Fat, Salt, and Acid. A squeeze of fresh lime juice and a pinch of salt can fix almost any sauce imbalance!`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a world-class professional chef assistant helping someone cook "${params.recipeTitle}".
Ingredients in this dish: ${params.recipeIngredients.join(", ")}.
The cook asks: "${params.question}"

Provide a concise (2-4 sentences), ultra-actionable, expert answer focusing on culinary technique, rapid pantry substitutions, heat control, or sauce recovery. Keep tone warm, encouraging, and razor-sharp.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.warn("Chef Q&A fallback:", error);
    return "Chef Tip: Adjust heat to medium-low, taste for seasoning, and balance richness with a few drops of lime juice or vinegar.";
  }
}
