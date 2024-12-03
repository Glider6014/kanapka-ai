export type GenerateRecipeInput = {
  ingredients: string; // Ingredients and quantities the user has in the fridge
  count: number; // Number of recipes to generate
};

export type RecipeIngredient = {
  ingredient: string;
  amount: number;
};

export type GeneratedIngredient = {
  ingredient: string; // name of the ingredient
  amount: number;
  unit?: string;
};

export type RecipeOutput = {
  name: string;
  description: string;
  ingredients: GeneratedIngredient[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type GenerateRecipeOutput = RecipeOutput[];
