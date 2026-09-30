import { MongoClient } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB_NAME || "pantrypro";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

const INITIAL_RECIPES = [
  {
    title: "Smoked Paneer & Spinach Bhurji Tacos",
    tagline: "15-minute high-protein fusion combining Punjabi dhaba flavors with charred street taco flair.",
    description: "Crumpled paneer spiced with toasted cumin, turmeric, fresh spinach, and pickled red onions loaded into warm blistered tortillas.",
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: "Indo-Mexican Fusion",
    flavorProfiles: ["Smoky", "Spicy", "Comforting", "Zesty & Tangy"],
    dietaryFlags: ["Vegetarian", "High-Protein", "Eggless"],
    ingredients: [
      { item: "Paneer (crumbled)", amount: "200g", notes: "Can substitute extra-firm tofu" },
      { item: "Baby Spinach (chopped)", amount: "2 cups", notes: "Wilted in final 2 minutes" },
      { item: "Red Onion (finely chopped)", amount: "1 medium" },
      { item: "Roma Tomato", amount: "1 medium" },
      { item: "Small Corn or Flour Tortillas", amount: "4-6 tortillas" },
      { item: "Garam Masala & Cumin Seeds", amount: "1 tsp each" },
      { item: "Fresh Lime Juice & Cilantro", amount: "1 lime + 2 tbsp chopped" },
      { item: "Ghee or Olive Oil", amount: "1 tbsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Heat ghee in a skillet over medium-high heat. Add cumin seeds; let crackle for 20 seconds.", chefTip: "Never overheat dry cumin seeds—golden brown unlocks essential cineole oils.", durationMinutes: 1 },
      { stepNumber: 2, instruction: "Sauté onions, chilies, ginger until caramelized. Add tomatoes, turmeric, garam masala; cook until oil separates.", chefTip: "Cook the tomato paste until glossy droplets form at edges.", durationMinutes: 4 },
      { stepNumber: 3, instruction: "Fold in crumbled paneer and fresh spinach. Sauté for 2 minutes until wilted.", chefTip: "Overcooking paneer squeezes moisture out. Remove from direct flame while moist.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Char tortillas on open flame for 15s per side. Spoon bhurji, top with pickled onions and fresh lime squeeze.", chefTip: "The hot char on tortilla adds essential maillard aroma.", durationMinutes: 3 }
    ],
    proChefTips: {
      heatControl: "Keep heat medium-high during initial spice bloom, then drop to medium-low when folding paneer.",
      acidityBalance: "Pickling half the onions in 1 tbsp lime juice with a pinch of salt gives sharp contrast.",
      restingTime: "Let bhurji rest off-heat for 60 seconds before assembling.",
      flavorBooster: "A pinch of crushed Kasuri Methi (fenugreek leaves) rubbed into the pan."
    },
    macros: { calories: 420, proteinGrams: 24, carbsGrams: 34, fatGrams: 22 },
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "12-Minute Garlic Butter Shrimp Scampi Rice Bowl",
    tagline: "Plump shrimp seared in foaming garlic-lemon butter over fluffy jasmine rice.",
    description: "Succulent shrimp flash-sautéed with minced garlic, crushed red pepper, and white wine/lemon, served steaming hot over fluffy leftover white rice.",
    prepTimeMinutes: 4,
    cookTimeMinutes: 8,
    totalTimeMinutes: 12,
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: "Modern Coastal Fusion",
    flavorProfiles: ["Zesty & Tangy", "Umami-rich", "Comforting"],
    dietaryFlags: ["Gluten-Free", "Eggless", "High-Protein"],
    ingredients: [
      { item: "Shrimp / Prawns (peeled and deveined)", amount: "300g", notes: "Patted dry with paper towel" },
      { item: "Cooked White Rice or Jasmine Rice", amount: "2.5 cups", notes: "Warm or day-old" },
      { item: "Garlic (minced)", amount: "5 cloves" },
      { item: "Unsalted Butter", amount: "2.5 tbsp" },
      { item: "Fresh Lemon Juice & Zest", amount: "1 whole lemon" },
      { item: "Extra Virgin Olive Oil", amount: "1 tbsp" },
      { item: "Fresh Parsley & Red Pepper Flakes", amount: "2 tbsp chopped + 1/2 tsp flakes" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Heat olive oil and 1 tbsp butter in a skillet over high heat. Sear dry shrimp for 90s without moving until pink and caramelized.", chefTip: "Dry shrimp prevents steaming.", durationMinutes: 2 },
      { stepNumber: 2, instruction: "Flip shrimp. Add minced garlic, red pepper flakes, remaining butter. Sauté for 60 seconds.", chefTip: "Add garlic after flipping so it doesn't scorch.", durationMinutes: 2 },
      { stepNumber: 3, instruction: "Deglaze pan with fresh lemon juice. Swirl pan off heat to emulsify butter into glossy sauce.", chefTip: "Swirling butter off heat creates glossy pan emulsion.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Spoon warm rice into bowls. Top with garlic shrimp and pan sauce. Garnish with parsley.", chefTip: "Rice absorbs every drop of garlic-lemon butter.", durationMinutes: 2 }
    ],
    proChefTips: {
      heatControl: "High heat for shrimp sear; drop heat when butter enters.",
      acidityBalance: "Lemon zest + juice cuts through rich butter.",
      restingTime: "Serve immediately while shrimp are tender.",
      flavorBooster: "A splash of dry white wine or pinch of smoked paprika."
    },
    macros: { calories: 440, proteinGrams: 32, carbsGrams: 48, fatGrams: 14 },
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "15-Minute Sweet Chili Lime Prawn Fried Rice",
    tagline: "Crispy wok-tossed day-old rice with glazed sweet chili prawns and scallions.",
    description: "Sizzling prawns coated in sticky sweet chili and tamari, tossed with crispy cold rice, ginger, and fresh lime wedges.",
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: "Southeast Asian Street-Fusion",
    flavorProfiles: ["Sweet & Savory", "Spicy", "Umami-rich", "Zesty & Tangy"],
    dietaryFlags: ["Gluten-Free", "Eggless", "High-Protein", "Dairy-Free"],
    ingredients: [
      { item: "Shrimp / Prawns", amount: "250g" },
      { item: "Cold Day-Old Jasmine Rice", amount: "3 cups" },
      { item: "Sweet Chili Sauce & Tamari", amount: "2 tbsp sweet chili + 1 tbsp tamari" },
      { item: "Fresh Ginger & Garlic", amount: "1 tbsp ginger + 3 cloves garlic" },
      { item: "Scallions & Cilantro", amount: "3 stalks + handful cilantro" },
      { item: "Sesame Oil & Cooking Oil", amount: "1 tsp sesame + 1.5 tbsp oil" },
      { item: "Lime Wedges", amount: "1 lime" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Sear prawns in hot wok for 2 minutes. Toss with 1 tbsp sweet chili; remove prawns to a plate.", chefTip: "Removing prawns keeps them juicy.", durationMinutes: 3 },
      { stepNumber: 2, instruction: "In same wok, sauté ginger and garlic. Add cold rice, let sear for 60 seconds untouched for crispy edges.", chefTip: "Untouched sear develops wok hei.", durationMinutes: 3 },
      { stepNumber: 3, instruction: "Drizzle tamari and remaining sweet chili around hot rim of pan. Toss vigorously.", chefTip: "Rim pouring caramelizes sugars instantly.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Fold prawns and scallions back into rice for 60s. Drizzle sesame oil and serve with lime.", chefTip: "Lime cuts through sweet chili glaze.", durationMinutes: 2 }
    ],
    proChefTips: {
      heatControl: "Maintain high wok heat throughout.",
      acidityBalance: "Key lime squeeze cuts sweet chili sweetness.",
      restingTime: "Serve straight from smoking wok.",
      flavorBooster: "Crispy fried shallots on top."
    },
    macros: { calories: 460, proteinGrams: 28, carbsGrams: 62, fatGrams: 10 },
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "12-Minute Charred Corn & Black Bean Chipotle Bowl",
    tagline: "Smoky, zesty, fiber-loaded powerhouse with creamy avocado crema.",
    description: "Charred sweet corn kernels, spiced black beans, leftover quinoa/rice, and pickled jalapenos drizzled with lime-chipotle crema.",
    prepTimeMinutes: 4,
    cookTimeMinutes: 8,
    totalTimeMinutes: 12,
    difficulty: "Ultra-Fast (10m)",
    servings: 1,
    cuisine: "Mexican Quick-Bite",
    flavorProfiles: ["Smoky", "Zesty & Tangy", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegan", "Gluten-Free", "Eggless", "High-Protein"],
    ingredients: [
      { item: "Canned Sweet Corn (drained)", amount: "1 cup" },
      { item: "Canned Black Beans (rinsed)", amount: "1 cup" },
      { item: "Cooked Brown Rice or Quinoa", amount: "1 cup" },
      { item: "Chipotle in Adobo (or smoked paprika)", amount: "1 tsp" },
      { item: "Ripe Avocado", amount: "1/2 avocado" },
      { item: "Lime & Fresh Cilantro", amount: "1 whole lime + handful cilantro" },
      { item: "Olive Oil & Sea Salt", amount: "1 tbsp oil, salt to taste" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Get dry skillet screaming hot. Add corn kernels in a single layer without moving for 2 minutes until blackened.", chefTip: "Dry heat chars corn sugars into caramel.", durationMinutes: 3 },
      { stepNumber: 2, instruction: "Toss black beans into skillet with chipotle paste, cumin, and 2 tbsp water to create a glossy glaze.", chefTip: "Water emulsifies spices into clingy sauce.", durationMinutes: 2 },
      { stepNumber: 3, instruction: "Warm leftover rice with lime squeeze. Mash avocado with lime juice, garlic powder, sea salt.", chefTip: "Season base rice to prevent blandness.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Assemble: Warm rice, charred corn, chipotle beans, avocado crema swirl, cilantro.", chefTip: "Flaky sea salt on avocado for salinity bursts.", durationMinutes: 1 }
    ],
    proChefTips: {
      heatControl: "Cast iron at high heat dry for corn; medium for beans.",
      acidityBalance: "Double dose of lime in avocado and over corn.",
      restingTime: "Serve immediately while corn is warm and crema cool.",
      flavorBooster: "Toasted pumpkin seeds (pepitas) for crunchy contrast."
    },
    macros: { calories: 460, proteinGrams: 18, carbsGrams: 68, fatGrams: 14 },
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Miso-Brown-Butter Garlic Fried Rice",
    tagline: "The ultimate 10-minute umami bomb using day-old rice and pantry aromatics.",
    description: "Cold day-old rice crisped in nutty browned butter emulsified with white miso, crispy fried garlic chips, and scallions.",
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    totalTimeMinutes: 10,
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: "Japanese-French Fusion",
    flavorProfiles: ["Umami-rich", "Comforting", "Smoky"],
    dietaryFlags: ["Vegetarian", "Eggless", "Nut-Free"],
    ingredients: [
      { item: "Cooked Day-Old Rice", amount: "3 cups" },
      { item: "Unsalted Butter", amount: "2.5 tbsp" },
      { item: "White or Red Miso Paste", amount: "1.5 tbsp" },
      { item: "Garlic (thinly sliced)", amount: "4 cloves" },
      { item: "Soy Sauce", amount: "1 tbsp" },
      { item: "Scallions", amount: "3 stalks" },
      { item: "Toasted Sesame Oil & Seeds", amount: "1 tsp each" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Melt 1 tbsp butter over medium-low heat. Fry sliced garlic until pale golden (90s). Remove chips; keep butter in pan.", chefTip: "Pull garlic chips 5s before done.", durationMinutes: 2 },
      { stepNumber: 2, instruction: "Crank heat to medium-high. Add remaining butter until foaming and nutty. Add scallion whites.", chefTip: "Browned milk solids amplify miso.", durationMinutes: 2 },
      { stepNumber: 3, instruction: "Add chilled rice. Press flat against hot pan for 90s for crispy edges, then toss.", chefTip: "Tossing preserves individual grain structure.", durationMinutes: 2 },
      { stepNumber: 4, instruction: "Drizzle miso-water slurry and soy sauce around perimeter of pan to caramelize before tossing. Top with garlic chips.", chefTip: "Perimeter pouring creates wok hei aromatics.", durationMinutes: 1 }
    ],
    proChefTips: {
      heatControl: "High heat during rice frying is essential.",
      acidityBalance: "1/2 tsp rice vinegar right before serving cuts butter richness.",
      restingTime: "None! Eat sizzling from the pan.",
      flavorBooster: "Furikake or crushed nori seaweed flakes."
    },
    macros: { calories: 380, proteinGrams: 8, carbsGrams: 52, fatGrams: 16 },
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "10-Minute Cardamom-Pistachio Warm Eggless Mug Cake",
    tagline: "Instant, decadent spiced dessert with molten core—no eggs, no oven required.",
    description: "Fluffy sponge infused with green cardamom, toasted pistachios, and a hidden dark chocolate molten center.",
    prepTimeMinutes: 3,
    cookTimeMinutes: 2,
    totalTimeMinutes: 5,
    difficulty: "Ultra-Fast (10m)",
    servings: 1,
    cuisine: "Desi-Modernist Patisserie",
    flavorProfiles: ["Sweet & Savory", "Comforting", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegetarian", "Eggless", "Nut-Free"],
    ingredients: [
      { item: "All-Purpose Flour", amount: "4 tbsp" },
      { item: "Brown Sugar", amount: "2 tbsp" },
      { item: "Ground Green Cardamom", amount: "1/2 tsp" },
      { item: "Baking Powder & Salt", amount: "1/4 tsp baking powder + pinch salt" },
      { item: "Milk (Oat or Dairy)", amount: "3 tbsp" },
      { item: "Melted Butter or Oil", amount: "1 tbsp" },
      { item: "Dark Chocolate Chunk", amount: "1 tbsp" },
      { item: "Crushed Pistachios", amount: "1 tsp" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "In a microwave mug, whisk flour, brown sugar, cardamom, baking powder, salt.", chefTip: "Salt elevates spice notes and cuts bitterness.", durationMinutes: 1 },
      { stepNumber: 2, instruction: "Pour milk and melted butter. Whisk until silky. Push chocolate chunk into center.", chefTip: "Do not overmix; 20 turns keeps gluten tender.", durationMinutes: 1 },
      { stepNumber: 3, instruction: "Microwave on High (800-900W) for 65-75 seconds.", chefTip: "Stop at 65s if microwave is strong.", durationMinutes: 1 },
      { stepNumber: 4, instruction: "Let sit 60s to set. Top with crushed pistachios and honey drizzle.", chefTip: "Resting equalizes steam in crumb.", durationMinutes: 1 }
    ],
    proChefTips: {
      heatControl: "70 seconds in microwave is the sweet spot for molten center.",
      acidityBalance: "2 drops lemon juice activates baking powder for instant lift.",
      restingTime: "1 minute rest allows chocolate to melt into silky lava.",
      flavorBooster: "A drop of rose water or orange blossom water."
    },
    macros: { calories: 290, proteinGrams: 5, carbsGrams: 38, fatGrams: 14 },
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "15-Minute Gochujang Honey Garlic Crisp Noodles",
    tagline: "Spicy, sticky, savory ramen noodles tossed in a caramelized Korean chili-garlic glaze.",
    description: "Instant ramen cakes transformed with sweet-spicy gochujang, crushed garlic, sesame oil, and scallions in a 5-minute pan toss.",
    prepTimeMinutes: 3,
    cookTimeMinutes: 7,
    totalTimeMinutes: 10,
    difficulty: "Ultra-Fast (10m)",
    servings: 1,
    cuisine: "Korean Street-Fusion",
    flavorProfiles: ["Spicy", "Sweet & Savory", "Umami-rich"],
    dietaryFlags: ["Vegetarian", "Eggless", "Dairy-Free"],
    ingredients: [
      { item: "Instant Ramen Noodles", amount: "1 pack" },
      { item: "Gochujang", amount: "1.5 tbsp" },
      { item: "Honey or Maple Syrup", amount: "1 tbsp" },
      { item: "Soy Sauce", amount: "1 tbsp" },
      { item: "Garlic (grated)", amount: "3 cloves" },
      { item: "Toasted Sesame Oil", amount: "1 tbsp" },
      { item: "Scallions & Sesame Seeds", amount: "2 stalks + 1 tsp seeds" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Boil ramen for 2 minutes. Reserve 3 tbsp starch water, then drain.", chefTip: "Undercooking keeps noodles springy.", durationMinutes: 3 },
      { stepNumber: 2, instruction: "Whisk gochujang, honey, soy sauce, garlic, sesame oil with noodle water.", chefTip: "Starch water creates clinging gloss.", durationMinutes: 1 },
      { stepNumber: 3, instruction: "Caramelize sauce in high heat skillet for 30s.", chefTip: "Caramelizing takes away raw pungency.", durationMinutes: 1 },
      { stepNumber: 4, instruction: "Toss noodles and scallions for 60s until lacquered.", chefTip: "Air tossing aerates the glaze.", durationMinutes: 2 }
    ],
    proChefTips: {
      heatControl: "High heat in final toss.",
      acidityBalance: "Splash of rice vinegar balances honey.",
      restingTime: "Serve immediately.",
      flavorBooster: "Chili crisp on top."
    },
    macros: { calories: 440, proteinGrams: 10, carbsGrams: 64, fatGrams: 16 },
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rapid Coconut Dal Tadka with Crispy Curry Leaves",
    tagline: "Velvety yellow lentils tempered with hot mustard seeds, cumin, and fragrant coconut milk.",
    description: "Fast-cooking red lentils (masoor dal) infused with turmeric and garlic, finished with a smoking ghee/oil tadka of curry leaves and whole chilies.",
    prepTimeMinutes: 5,
    cookTimeMinutes: 15,
    totalTimeMinutes: 20,
    difficulty: "Quick (20m)",
    servings: 3,
    cuisine: "Coastal Indian",
    flavorProfiles: ["Comforting", "Smoky", "Creamy", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegan", "Gluten-Free", "Eggless", "High-Protein"],
    ingredients: [
      { item: "Red Split Lentils", amount: "1 cup" },
      { item: "Coconut Milk", amount: "1/2 cup" },
      { item: "Turmeric & Coriander", amount: "1/2 tsp + 1 tsp" },
      { item: "Mustard & Cumin Seeds", amount: "1 tsp each" },
      { item: "Fresh Curry Leaves", amount: "10-12 leaves" },
      { item: "Garlic", amount: "4 cloves" }
    ],
    instructions: [
      { stepNumber: 1, instruction: "Simmer lentils with water, turmeric, garlic for 12 mins.", chefTip: "Red lentils break down without soaking.", durationMinutes: 12 },
      { stepNumber: 2, instruction: "Whisk into smooth soup; stir in coconut milk.", chefTip: "Whisking releases natural starches.", durationMinutes: 2 },
      { stepNumber: 3, instruction: "Temper mustard, cumin, curry leaves in hot ghee for 15s.", chefTip: "Curry leaves crisp into emerald glass.", durationMinutes: 1 },
      { stepNumber: 4, instruction: "Pour sizzling tadka over dal and cover for 60s.", chefTip: "Trap the fragrant smoke inside.", durationMinutes: 1 }
    ],
    proChefTips: {
      heatControl: "High heat on tadka ladle; low simmer on dal.",
      acidityBalance: "Lemon juice squeeze in bowl.",
      restingTime: "2 min rest with lid on.",
      flavorBooster: "Pinch of hing (asafoetida)."
    },
    macros: { calories: 340, proteinGrams: 17, carbsGrams: 46, fatGrams: 10 },
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
  }
];

function generateSimulatedVector(text) {
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
  const mag = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / mag);
}

async function runSeed() {
  console.log("🌱 Starting PantryPro database seeding with expanded recipes...");

  let genAI = null;
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log("✨ Gemini API Key detected. Using text-embedding-004 for vector embeddings.");
  } else {
    console.log("ℹ️ Generating simulated 768-dim normalized embeddings.");
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas cluster.");
    const db = client.db(DB_NAME);
    const collection = db.collection("recipes");

    const enriched = await Promise.all(
      INITIAL_RECIPES.map(async (recipe) => {
        const text = `${recipe.title}. ${recipe.tagline}. ${recipe.description}. Cuisine: ${recipe.cuisine}. Flavors: ${recipe.flavorProfiles.join(", ")}. Ingredients: ${recipe.ingredients.map(i => `${i.amount} ${i.item}`).join(", ")}.`;
        let embedding = [];

        if (genAI) {
          try {
            const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const res = await model.embedContent(text);
            embedding = res.embedding.values;
          } catch (e) {
            embedding = generateSimulatedVector(text);
          }
        } else {
          embedding = generateSimulatedVector(text);
        }

        return {
          ...recipe,
          embedding,
          createdAt: new Date().toISOString(),
        };
      })
    );

    await collection.deleteMany({ isCustom: { $ne: true } });
    const result = await collection.insertMany(enriched);
    console.log(`🎉 Successfully seeded ${result.insertedCount} recipes into MongoDB Atlas!`);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await client.close();
  }
}

runSeed();
