import { Recipe } from "./types";

export const INITIAL_RECIPES: Recipe[] = [
  {
    _id: "rec_101",
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
      { item: "Red Onion (finely chopped)", amount: "1 medium", notes: "Half sautéed, half quick-pickled in lime" },
      { item: "Roma Tomato", amount: "1 medium", notes: "Diced" },
      { item: "Small Corn or Flour Tortillas", amount: "4-6 tortillas" },
      { item: "Garam Masala & Cumin Seeds", amount: "1 tsp each" },
      { item: "Fresh Lime Juice & Cilantro", amount: "1 lime + 2 tbsp chopped", notes: "For acidity finish" },
      { item: "Ghee or Olive Oil", amount: "1 tbsp" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Heat ghee in a cast-iron or heavy skillet over medium-high heat. Add cumin seeds; let them crackle and perfume the oil for 20 seconds.",
        chefTip: "Never overheat dry cumin seeds—golden brown unlocks essential cineole oils without bitter notes.",
        durationMinutes: 1
      },
      {
        stepNumber: 2,
        instruction: "Sauté chopped onions, green chilies, and ginger until edges caramelize (3 mins). Add diced tomatoes, turmeric, and garam masala; smash with back of spoon until oil separates.",
        chefTip: "The 'Bhuna' technique: cook the tomato paste until glossy droplets form around the edges.",
        durationMinutes: 4
      },
      {
        stepNumber: 3,
        instruction: "Fold in the crumbled paneer and fresh spinach. Sauté vigorously for 2 minutes just until spinach wilts and paneer stays pillow-soft.",
        chefTip: "Overcooking paneer squeezes moisture out. Remove from direct flame while still moist.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Char tortillas over open flame or dry hot pan for 15 seconds per side until blistered. Spoon generous bhurji, top with pickled onions, cilantro, and fresh lime squeeze.",
        chefTip: "The hot char on the tortilla adds essential maillard aroma that cuts through the rich dairy.",
        durationMinutes: 3
      }
    ],
    proChefTips: {
      heatControl: "Keep heat medium-high during the initial spice bloom, then drop to medium-low when folding paneer.",
      acidityBalance: "Pickling half the chopped onions in 1 tbsp lime juice with a pinch of salt provides crucial sharp contrast against the creamy paneer.",
      restingTime: "Let the bhurji rest off-heat for 60 seconds before filling tacos so juices settle.",
      flavorBooster: "A pinch of crushed Kasuri Methi (fenugreek leaves) rubbed between palms directly into the pan."
    },
    macros: {
      calories: 420,
      proteinGrams: 24,
      carbsGrams: 34,
      fatGrams: 22
    },
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_102",
    title: "12-Minute Charred Corn & Black Bean Chipotle Bowl",
    tagline: "Smoky, zesty, fiber-loaded powerhouse with creamy avocado crema.",
    description: "Charred sweet corn kernels, spiced black beans, leftover quinoa/rice, and pickled jalapenos drizzled with a 30-second lime-chipotle crema.",
    prepTimeMinutes: 4,
    cookTimeMinutes: 8,
    totalTimeMinutes: 12,
    difficulty: "Ultra-Fast (10m)",
    servings: 1,
    cuisine: "Mexican Quick-Bite",
    flavorProfiles: ["Smoky", "Zesty & Tangy", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegan", "Gluten-Free", "Eggless", "High-Protein"],
    ingredients: [
      { item: "Canned Sweet Corn (drained)", amount: "1 cup", notes: "Pat dry for maximum char" },
      { item: "Canned Black Beans (rinsed)", amount: "1 cup" },
      { item: "Cooked Brown Rice or Quinoa", amount: "1 cup", notes: "Leftover cold rice works best" },
      { item: "Chipotle in Adobo (or smoked paprika)", amount: "1 tsp" },
      { item: "Ripe Avocado or Greek Yogurt/Vegan Mayo", amount: "1/2 avocado", notes: "Blended with lime & salt" },
      { item: "Lime & Fresh Cilantro", amount: "1 whole lime + handful cilantro" },
      { item: "Olive Oil & Sea Salt", amount: "1 tbsp oil, flaky salt to taste" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Get a dry skillet screaming hot. Add dried corn kernels in a single layer without moving for 2 minutes until blackened and popped.",
        chefTip: "Dry heat chars corn sugars into deep caramel without steaming them into sogginess.",
        durationMinutes: 3
      },
      {
        stepNumber: 2,
        instruction: "Toss black beans into the skillet with chipotle paste, ground cumin, and 2 tbsp water to create a rich glossy glaze around the beans.",
        chefTip: "Stirring in a splash of water emulsifies the spices into a clingy sauce.",
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        instruction: "Warm your leftover rice with a squeeze of lime and a dash of olive oil. Mash avocado with lime juice, garlic powder, and sea salt.",
        chefTip: "Seasoning the base rice layer prevents blandness at the bottom of the bowl.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Assemble: Warm rice base, charred corn, chipotle beans, avocado crema swirl, pumpkin seeds, and fresh cilantro sprigs.",
        chefTip: "Finish with flaky sea salt right on the avocado for micro-bursts of salinity.",
        durationMinutes: 1
      }
    ],
    proChefTips: {
      heatControl: "Cast iron pan at high heat dry for corn; medium heat for beans.",
      acidityBalance: "Double dose of lime—first in the avocado mash, then a fresh wedge spritzed over the charred corn.",
      restingTime: "Serve immediately while corn is warm and avocado crema is cool.",
      flavorBooster: "Toasted pumpkin seeds (pepitas) toasted in 30 seconds for crunchy textural contrast."
    },
    macros: {
      calories: 460,
      proteinGrams: 18,
      carbsGrams: 68,
      fatGrams: 14
    },
    image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_103",
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
      { item: "Garlic (minced)", amount: "5 cloves", notes: "Thinly sliced or minced" },
      { item: "Unsalted Butter", amount: "2.5 tbsp" },
      { item: "Fresh Lemon Juice & Zest", amount: "1 whole lemon" },
      { item: "Extra Virgin Olive Oil", amount: "1 tbsp" },
      { item: "Fresh Parsley & Red Pepper Flakes", amount: "2 tbsp chopped + 1/2 tsp flakes" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Heat olive oil and 1 tbsp butter in a large skillet over high heat until sizzling. Add dry shrimp in a single layer without touching for 90 seconds until pink and caramelized.",
        chefTip: "Dry shrimp surface is essential for high-heat caramelization without releasing watery steam.",
        durationMinutes: 2
      },
      {
        stepNumber: 2,
        instruction: "Flip shrimp. Add minced garlic, red pepper flakes, and remaining butter. Sauté for 60 seconds until garlic is fragrant and golden.",
        chefTip: "Add garlic after flipping so it doesn't scorch while the shrimp sears.",
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        instruction: "Deglaze pan with fresh lemon juice. Swirl pan vigorously off heat to emulsify lemon juice and melting butter into a glossy velvet sauce.",
        chefTip: "Monté au beurre: swirling butter off heat creates a restaurant-grade glossy pan emulsion.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Spoon warm fluffy rice into bowls. Top with garlic shrimp and drizzle all pan sauce over the rice. Garnish with chopped parsley and lemon zest.",
        chefTip: "Rice absorbs every drop of the garlic-lemon butter sauce.",
        durationMinutes: 2
      }
    ],
    proChefTips: {
      heatControl: "High heat for the initial 90s shrimp sear; drop heat when butter and garlic enter.",
      acidityBalance: "Lemon zest adds aromatic citrus oils, while lemon juice balances the heavy butter richness.",
      restingTime: "Serve immediately while shrimp are tender and juicy.",
      flavorBooster: "A splash of dry white wine or a pinch of smoked paprika in the garlic butter."
    },
    macros: {
      calories: 440,
      proteinGrams: 32,
      carbsGrams: 48,
      fatGrams: 14
    },
    image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_104",
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
      { item: "Shrimp / Prawns", amount: "250g", notes: "Tailed and cleaned" },
      { item: "Cold Day-Old Jasmine Rice", amount: "3 cups" },
      { item: "Sweet Chili Sauce & Soy Sauce/Tamari", amount: "2 tbsp sweet chili + 1 tbsp tamari" },
      { item: "Fresh Ginger & Garlic", amount: "1 tbsp grated ginger + 3 cloves garlic" },
      { item: "Scallions & Cilantro", amount: "3 stalks scallions + handful cilantro" },
      { item: "Sesame Oil & Neutral Oil", amount: "1 tsp sesame oil + 1.5 tbsp cooking oil" },
      { item: "Lime Wedges", amount: "1 lime cut into wedges" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Heat cooking oil in a wok or large skillet over high heat. Sear prawns for 2 minutes until pink. Toss with 1 tbsp sweet chili sauce; remove prawns to a plate.",
        chefTip: "Removing prawns early keeps them succulent while rice fries.",
        durationMinutes: 3
      },
      {
        stepNumber: 2,
        instruction: "In the same hot wok, add ginger and garlic for 20 seconds. Add cold day-old rice, breaking clumps with a spatula.",
        chefTip: "Let the rice sear untouched for 60 seconds to develop crispy wok-hei edges.",
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        instruction: "Drizzle soy sauce and remaining sweet chili sauce around the hot rim of the pan. Toss rice vigorously until grains are evenly coated.",
        chefTip: "Rim pouring caramelizes the natural sugars instantly.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Fold prawns and scallions back into the rice for 60 seconds. Drizzle sesame oil and serve with lime wedges.",
        chefTip: "A fresh lime squeeze over hot fried rice cuts through sweet chili glaze.",
        durationMinutes: 2
      }
    ],
    proChefTips: {
      heatControl: "Maintain screaming high wok heat for crisp non-soggy rice grains.",
      acidityBalance: "Key lime squeeze is essential to balance the sweet chili sugars.",
      restingTime: "Serve straight from the smoking wok.",
      flavorBooster: "Crispy fried shallots and toasted sesame seeds on top."
    },
    macros: {
      calories: 460,
      proteinGrams: 28,
      carbsGrams: 62,
      fatGrams: 10
    },
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_105",
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
      { item: "Cooked Day-Old Jasmine or Basmati Rice", amount: "3 cups", notes: "Chilled and separated with fingers" },
      { item: "Unsalted Butter", amount: "2.5 tbsp" },
      { item: "White or Red Miso Paste", amount: "1.5 tbsp", notes: "Dissolved in 1 tbsp warm water" },
      { item: "Garlic (thinly sliced)", amount: "4 cloves", notes: "Fried until golden chips" },
      { item: "Soy Sauce (Tamari for GF)", amount: "1 tbsp" },
      { item: "Scallions (greens and whites separated)", amount: "3 stalks" },
      { item: "Toasted Sesame Oil & Toasted Sesame Seeds", amount: "1 tsp oil + 1 tsp seeds" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Melt 1 tbsp butter in a large skillet over medium-low heat. Fry sliced garlic until pale golden (about 90 seconds). Remove garlic chips to a paper towel; keep the garlic butter in pan.",
        chefTip: "Pull garlic chips 5 seconds before you think they are done—residual heat carries them to perfection.",
        durationMinutes: 2
      },
      {
        stepNumber: 2,
        instruction: "Crank heat to medium-high. Add remaining butter until it foams and smells nutty with hazelnut specks. Add scallion whites.",
        chefTip: "Browning the milk solids in butter creates nutty lactones that amplify the miso.",
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        instruction: "Add chilled rice. Press flat against the hot pan and let it sear without touching for 90 seconds for crispy edges, then toss vigorously.",
        chefTip: "Do not crowd and smash—flicking and tossing preserves individual rice grain structure.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Drizzle the miso-water slurry and soy sauce around the perimeter of the pan so it caramelizes on contact before tossing into the rice. Top with scallion greens and crunchy garlic chips.",
        chefTip: "Pouring sauces along the smoking perimeter creates 'Wok Hei' aromatics even in a standard skillet.",
        durationMinutes: 1
      }
    ],
    proChefTips: {
      heatControl: "High heat during rice frying is non-negotiable to prevent soggy grains.",
      acidityBalance: "A microscopic splash of rice vinegar (1/2 tsp) right before serving cuts through rich butter.",
      restingTime: "None! Eat piping hot directly from the wok/pan.",
      flavorBooster: "Furikake or a pinch of crushed nori seaweed flakes on top."
    },
    macros: {
      calories: 380,
      proteinGrams: 8,
      carbsGrams: 52,
      fatGrams: 16
    },
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_106",
    title: "15-Minute Creamy Tuscan Garlic White Bean Skillet",
    tagline: "Velvety sun-dried tomato and baby kale skillet with crusty bread for dipping.",
    description: "Cannellini beans simmered with garlic, sun-dried tomatoes, coconut cream/heavy cream, and fresh herbs into a luxurious comfort dip.",
    prepTimeMinutes: 5,
    cookTimeMinutes: 10,
    totalTimeMinutes: 15,
    difficulty: "Ultra-Fast (10m)",
    servings: 2,
    cuisine: "Modern Mediterranean",
    flavorProfiles: ["Creamy", "Umami-rich", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegetarian", "Gluten-Free", "Eggless", "High-Protein"],
    ingredients: [
      { item: "Canned Cannellini or Great Northern Beans", amount: "2 cans (15 oz each)", notes: "1 can mashed slightly, 1 whole" },
      { item: "Sun-Dried Tomatoes in Oil", amount: "1/3 cup", notes: "Chopped, reserve 1 tbsp oil" },
      { item: "Garlic (minced)", amount: "4 cloves" },
      { item: "Heavy Cream or Full-Fat Coconut Milk", amount: "1/2 cup" },
      { item: "Baby Spinach or Tuscan Kale", amount: "2 big handfuls" },
      { item: "Vegetable Broth", amount: "1/2 cup" },
      { item: "Lemon Juice & Fresh Basil / Dried Oregano", amount: "1 tbsp lemon + 1 tsp oregano" },
      { item: "Crusty Sourdough or Pita (optional)", amount: "For serving" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Warm reserved sun-dried tomato oil in a skillet over medium heat. Sauté minced garlic and crushed red pepper flakes for 45 seconds until aromatic.",
        chefTip: "The tomato-infused oil carries deep carotenoid flavors straight into the aromatics.",
        durationMinutes: 1
      },
      {
        stepNumber: 2,
        instruction: "Add chopped sun-dried tomatoes, vegetable broth, and the white beans. Mash roughly 1/3 of the beans with a fork to thicken the broth naturally.",
        chefTip: "Mashing starch-rich beans creates a creamy emulsion without needing flour or cornstarch.",
        durationMinutes: 3
      },
      {
        stepNumber: 3,
        instruction: "Pour in cream/coconut milk and oregano. Simmer on medium-low for 4 minutes until thick, glossy, and bubbling gently.",
        chefTip: "Keep at a gentle simmer; boiling dairy aggressively will cause the emulsion to separate.",
        durationMinutes: 4
      },
      {
        stepNumber: 4,
        instruction: "Turn off heat. Fold in baby spinach and fresh lemon juice until greens wilt from residual heat. Garnish with cracked black pepper and fresh basil.",
        chefTip: "Adding lemon juice with heat turned off preserves its vibrant floral terpenes.",
        durationMinutes: 2
      }
    ],
    proChefTips: {
      heatControl: "Gentle simmer throughout; high heat breaks the cream.",
      acidityBalance: "Sun-dried tomatoes have concentrated malic acid; balance with lemon juice brightness right at the finish.",
      restingTime: "Let sit for 2 minutes off burner to let sauce thicken to a spoon-coating velvet.",
      flavorBooster: "A shaved piece of parmesan rind simmered with the beans (or nutritional yeast for vegan)."
    },
    macros: {
      calories: 390,
      proteinGrams: 16,
      carbsGrams: 42,
      fatGrams: 18
    },
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_107",
    title: "10-Minute Cardamom-Pistachio Warm Eggless Mug Cake",
    tagline: "Instant, decadent spiced dessert with molten core—no eggs, no oven required.",
    description: "Fluffy sponge infused with freshly ground green cardamom, toasted pistachios, and a hidden dark chocolate or caramel center.",
    prepTimeMinutes: 3,
    cookTimeMinutes: 2,
    totalTimeMinutes: 5,
    difficulty: "Ultra-Fast (10m)",
    servings: 1,
    cuisine: "Desi-Modernist Patisserie",
    flavorProfiles: ["Sweet & Savory", "Comforting", "Fresh & Herbaceous"],
    dietaryFlags: ["Vegetarian", "Eggless", "Nut-Free"],
    ingredients: [
      { item: "All-Purpose Flour or Oat Flour", amount: "4 tbsp" },
      { item: "Brown Sugar or Jaggery Powder", amount: "2 tbsp" },
      { item: "Ground Green Cardamom", amount: "1/2 tsp", notes: "Freshly ground for best aroma" },
      { item: "Baking Powder & Pinch Salt", amount: "1/4 tsp baking powder + pinch salt" },
      { item: "Milk (Oat, Almond, or Dairy)", amount: "3 tbsp" },
      { item: "Melted Butter or Neutral Oil", amount: "1 tbsp" },
      { item: "Dark Chocolate Chunk or Pistachio Butter", amount: "1 tbsp", notes: "Pushed into center" },
      { item: "Crushed Pistachios & Rose Petals", amount: "1 tsp", notes: "For garnish" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "In a microwave-safe ceramic mug, whisk dry ingredients: flour, brown sugar, cardamom, baking powder, and a generous pinch of flaky salt.",
        chefTip: "Salt in sweet desserts elevates spice notes and suppresses bitterness.",
        durationMinutes: 1
      },
      {
        stepNumber: 2,
        instruction: "Pour in milk and melted butter. Whisk with a small fork until a silky, lump-free batter forms. Push the chocolate chunk into the exact center of the batter.",
        chefTip: "Do not overmix; 20 gentle turns with a fork keeps gluten relaxed for a tender crumb.",
        durationMinutes: 1
      },
      {
        stepNumber: 3,
        instruction: "Microwave on High (800-900W) for 65 to 75 seconds. The cake should rise with a slightly glossy moist top.",
        chefTip: "Stop at 65 seconds if your microwave is strong; microwave baked goods dry out quickly if overdone.",
        durationMinutes: 1
      },
      {
        stepNumber: 4,
        instruction: "Let sit for 60 seconds to set. Top with crushed emerald pistachios and a drizzle of honey or condensed milk.",
        chefTip: "Resting allows steam to equalize inside the crumb structure.",
        durationMinutes: 1
      }
    ],
    proChefTips: {
      heatControl: "Microwave bursts: 70 seconds is the sweet spot for a moist crumb and molten center.",
      acidityBalance: "Add 2 drops of lemon juice or a pinch of citric acid to the batter to activate the baking powder instantly for a light rise.",
      restingTime: "1 full minute rest prevents mouth burns and lets chocolate melt into silky lava.",
      flavorBooster: "A splash of rose water or orange blossom water (1/4 tsp) in the batter."
    },
    macros: {
      calories: 290,
      proteinGrams: 5,
      carbsGrams: 38,
      fatGrams: 14
    },
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_108",
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
      { item: "Instant Ramen Noodles (discard seasoning packet)", amount: "1 pack" },
      { item: "Gochujang (Korean red pepper paste)", amount: "1.5 tbsp" },
      { item: "Honey or Maple Syrup", amount: "1 tbsp" },
      { item: "Soy Sauce", amount: "1 tbsp" },
      { item: "Garlic (finely grated)", amount: "3 cloves" },
      { item: "Toasted Sesame Oil", amount: "1 tbsp" },
      { item: "Scallions & Toasted Sesame Seeds", amount: "2 stalks scallions + 1 tsp seeds" },
      { item: "Chili Crisp / Rayu (optional)", amount: "1 tsp" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Boil ramen noodles for 2 minutes (1 minute less than package instructions) so they stay al dente. Reserve 3 tbsp noodle starch water, then drain.",
        chefTip: "Undercooking noodles by 60 seconds allows them to absorb sauce in the skillet without turning mushy.",
        durationMinutes: 3
      },
      {
        stepNumber: 2,
        instruction: "In a small bowl, whisk gochujang, honey, soy sauce, grated garlic, and sesame oil with the hot reserved noodle water.",
        chefTip: "Starch water creates a glossy, clinging emulsion that locks onto every noodle ridge.",
        durationMinutes: 1
      },
      {
        stepNumber: 3,
        instruction: "Heat a skillet over high heat. Pour the sauce; let it bubble and caramelize for 30 seconds until sticky.",
        chefTip: "Caramelizing gochujang takes away raw fermented pungency and brings out rich umami sugars.",
        durationMinutes: 1
      },
      {
        stepNumber: 4,
        instruction: "Toss in cooked noodles and sliced scallions. Stir-fry vigorously for 60 seconds until every strand is coated and lacquered.",
        chefTip: "Continuous tossing aerates the sauce for a mirror-like shine.",
        durationMinutes: 2
      }
    ],
    proChefTips: {
      heatControl: "High heat in the final pan toss creates smoky caramelization.",
      acidityBalance: "A splash of rice vinegar (1/2 tsp) balances the heavy sweetness of honey and gochujang.",
      restingTime: "Serve immediately while sticky glaze is hot.",
      flavorBooster: "A fried egg on top with crispy lace edges (or crispy pan-fried tofu strips for eggless/vegan)."
    },
    macros: {
      calories: 440,
      proteinGrams: 10,
      carbsGrams: 64,
      fatGrams: 16
    },
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_109",
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
      { item: "Red Split Lentils (Masoor Dal)", amount: "1 cup", notes: "Rinsed; cooks in 12 minutes" },
      { item: "Coconut Milk", amount: "1/2 cup", notes: "Adds rich creaminess" },
      { item: "Turmeric & Ground Coriander", amount: "1/2 tsp turmeric + 1 tsp coriander" },
      { item: "Mustard Seeds & Cumin Seeds", amount: "1 tsp each" },
      { item: "Fresh Curry Leaves", amount: "10-12 leaves", notes: "Crucial coastal aromatics" },
      { item: "Dried Red Chilies or Serrano", amount: "2 whole" },
      { item: "Garlic (crushed)", amount: "4 cloves" },
      { item: "Coconut Oil or Ghee", amount: "1.5 tbsp" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "Add rinsed red lentils, 2.5 cups water, turmeric, crushed garlic, and 1 tsp salt to a pot. Bring to a boil, then simmer medium for 12 minutes until broken down and silky.",
        chefTip: "Red lentils break down naturally without soaking or pressure cooking.",
        durationMinutes: 12
      },
      {
        stepNumber: 2,
        instruction: "Whisk the cooked dal with a wire whisk to emulsify into a smooth soup. Stir in coconut milk and simmer for 2 minutes.",
        chefTip: "Whisking releases natural lentil starches into a creamy soup consistency.",
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        instruction: "The Tadka: Heat coconut oil/ghee in a small ladle or pan until shimmering. Add mustard seeds (let pop), cumin seeds, dried chilies, and fresh curry leaves for 15 seconds.",
        chefTip: "Temper spices at high heat—curry leaves should crisp up instantly like emerald glass.",
        durationMinutes: 1
      },
      {
        stepNumber: 4,
        instruction: "Pour the sizzling tadka directly over the dal. Cover with a lid immediately for 60 seconds to trap the fragrant smoke.",
        chefTip: "Trapping the steam forces volatile spice aromas back into the dal liquid.",
        durationMinutes: 1
      }
    ],
    proChefTips: {
      heatControl: "High heat on the tadka ladle; gentle low simmer for dal.",
      acidityBalance: "Finish with a generous squeeze of fresh lemon juice directly into the bowl.",
      restingTime: "Let the covered pot rest for 2 minutes after tempering before serving.",
      flavorBooster: "A pinch of hing (asafoetida) bloomed in the hot tadka oil."
    },
    macros: {
      calories: 340,
      proteinGrams: 17,
      carbsGrams: 46,
      fatGrams: 10
    },
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
  },
  {
    _id: "rec_110",
    title: "15-Minute Salted Tahini Chocolate Fudge Bites",
    tagline: "Rich, nutty no-bake confection with deep cacao and flaky Maldon sea salt.",
    description: "Creamy roasted sesame tahini blended with maple syrup, Dutch-processed cocoa, and coconut oil, chilled into melt-in-the-mouth squares.",
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    totalTimeMinutes: 10,
    difficulty: "Ultra-Fast (10m)",
    servings: 6,
    cuisine: "Middle Eastern Confection",
    flavorProfiles: ["Sweet & Savory", "Comforting", "Umami-rich"],
    dietaryFlags: ["Vegan", "Gluten-Free", "Eggless", "Nut-Free"],
    ingredients: [
      { item: "Runny Roasted Tahini (sesame paste)", amount: "1/2 cup", notes: "Well-stirred from bottom" },
      { item: "Pure Maple Syrup or Agave", amount: "1/3 cup" },
      { item: "Dutch-Processed Cocoa Powder", amount: "1/3 cup", notes: "Sifted for smooth texture" },
      { item: "Melted Virgin Coconut Oil", amount: "3 tbsp" },
      { item: "Pure Vanilla Extract", amount: "1 tsp" },
      { item: "Flaky Sea Salt (Maldon)", amount: "1 tsp", notes: "For finishing top" }
    ],
    instructions: [
      {
        stepNumber: 1,
        instruction: "In a heatproof bowl, whisk tahini, maple syrup, melted coconut oil, and vanilla extract until glossy and emulsified.",
        chefTip: "Tahini + maple syrup forms a naturally thick fudge base due to seed oil hydration.",
        durationMinutes: 2
      },
      {
        stepNumber: 2,
        instruction: "Sift cocoa powder and a pinch of fine salt into the wet mixture. Fold with a silicone spatula until a thick dough-like gloss forms.",
        chefTip: "Sifting prevents bitter cocoa clumps and ensures velvet mouthfeel.",
        durationMinutes: 2
      },
      {
        stepNumber: 3,
        instruction: "Press into a parchment-lined mini loaf pan or silicone mold (approx 1/2 inch thick). Sprinkle generously with coarse flaky sea salt.",
        chefTip: "Pressing parchment paper firmly prevents air pockets.",
        durationMinutes: 2
      },
      {
        stepNumber: 4,
        instruction: "Pop into freezer for 8-10 minutes until firm. Slice into bite-sized 1-inch squares and enjoy cold.",
        chefTip: "Coconut oil solidifies below 76°F (24°C), giving an instant firm snap that melts on the tongue.",
        durationMinutes: 4
      }
    ],
    proChefTips: {
      heatControl: "No stovetop heat required—just liquid warmth for coconut oil.",
      acidityBalance: "A drop of espresso or dark balsamic (optional) highlights the fruitiness of cacao.",
      restingTime: "Store in fridge/freezer; melts rapidly in warm hands!",
      flavorBooster: "Toasted white and black sesame seeds pressed into top."
    },
    macros: {
      calories: 180,
      proteinGrams: 4,
      carbsGrams: 16,
      fatGrams: 12
    },
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
  }
];

export const CHEF_PERSONAS = [
  {
    id: "michelin_pro" as const,
    name: "Chef Marco (Michelin Star)",
    subtitle: "Precision heat control, wine/vinegar deglazing & sauce emulsification",
    avatar: "👨‍🍳",
    focus: "Technique, Maillard reaction, micro-seasoning, presentation balance",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40"
  },
  {
    id: "weeknight_hustle" as const,
    name: "Chef Maya (10-Min Hustle)",
    subtitle: "Busy student & professional hacks for maximum flavor in single pans",
    avatar: "⚡",
    focus: "Speed, minimal cleanup, smart ingredient swaps, high-yield shortcuts",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
  },
  {
    id: "desi_modernist" as const,
    name: "Chef Rohan (Desi Modernist)",
    subtitle: "Spices blooming, tadka smoke infusion & balancing acidity with lime",
    avatar: "🌶️",
    focus: "Spice roasting, whole aromatics, coastal notes, eggless perfection",
    badgeColor: "bg-orange-500/20 text-orange-300 border-orange-500/40"
  },
  {
    id: "street_food_alchemist" as const,
    name: "Chef Kenji (Street Food Lab)",
    subtitle: "Crispy textures, high-heat wok searing & sweet-savory punch",
    avatar: "🔥",
    focus: "Wok hei aromatics, crispy charred edges, umami stacking",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
  },
  {
    id: "scientific_culinarian" as const,
    name: "Dr. Elena (Food Scientist)",
    subtitle: "Molecular gastronomy, pH balance, enzymatic tenderizing & moisture retention",
    avatar: "🔬",
    focus: "Starch gelatinization, lipid solubility of spices, thermal dynamics",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
  }
];

export const POPULAR_FRIDGE_ITEMS = [
  "Shrimp / Prawns", "Leftover Rice", "Paneer", "Baby Spinach", "Garlic",
  "Sweet Corn", "Black Beans", "Soy Sauce", "Gochujang", "Butter",
  "Coconut Milk", "Red Lentils", "Tahini", "Miso Paste", "Eggs",
  "Tofu", "Cherry Tomatoes", "Tortillas", "Greek Yogurt", "Lime"
];
