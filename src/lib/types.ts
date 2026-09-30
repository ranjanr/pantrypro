export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
  pantryEssential?: boolean;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  chefTip?: string;
  durationMinutes?: number;
}

export type FlavorProfile = 
  | "Comforting"
  | "Spicy"
  | "Umami-rich"
  | "Zesty & Tangy"
  | "Creamy"
  | "Smoky"
  | "Fresh & Herbaceous"
  | "Sweet & Savory";

export type DietaryFlag = 
  | "Vegan"
  | "Vegetarian"
  | "Gluten-Free"
  | "Eggless"
  | "High-Protein"
  | "Dairy-Free"
  | "Keto-Friendly"
  | "Nut-Free";

export type Difficulty = "Ultra-Fast (10m)" | "Quick (20m)" | "Balanced (30m)" | "Gourmet (45m+)";

export interface Recipe {
  _id?: string;
  title: string;
  tagline: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  difficulty: Difficulty;
  servings: number;
  cuisine: string;
  flavorProfiles: FlavorProfile[];
  dietaryFlags: DietaryFlag[];
  ingredients: Ingredient[];
  instructions: RecipeStep[];
  proChefTips: {
    heatControl?: string;
    acidityBalance?: string;
    restingTime?: string;
    flavorBooster?: string;
  };
  macros?: {
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatGrams: number;
  };
  image: string;
  embedding?: number[];
  vectorScore?: number;
  isCustom?: boolean;
  createdAt?: string;
  savedInVault?: boolean;
}

export type ChefPersonaType = 
  | "michelin_pro" 
  | "weeknight_hustle" 
  | "desi_modernist" 
  | "street_food_alchemist" 
  | "scientific_culinarian";

export interface ChefPersona {
  id: ChefPersonaType;
  name: string;
  subtitle: string;
  avatar: string;
  focus: string;
  badgeColor: string;
}

export interface RewrittenRecipeResponse {
  originalTitle: string;
  persona: ChefPersonaType;
  enhancedTagline: string;
  revisedInstructions: RecipeStep[];
  proSecrets: {
    heatControl: string;
    acidityAndBrighteners: string;
    texturalContrast: string;
    restingAndFinishing: string;
  };
  suggestedPantrySwaps: { original: string; swap: string; rationale: string }[];
}

export interface PantrySynthesisRequest {
  fridgeItems: string[];
  dietaryPreferences: DietaryFlag[];
  maxPrepTimeMinutes: number;
  spiceTolerance?: "Mild" | "Medium" | "Fire-Breather";
  cuisinePreference?: string;
}
