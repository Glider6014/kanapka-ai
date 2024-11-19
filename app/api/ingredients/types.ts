import type { IngredientType } from "@/models/Ingredient";

export type IngredientInput = {
  ingredient: string; // Can contain comma-separated ingredients
};

export type IngredientAnalysisResult = IngredientType;
export type IngredientAnalysisResults = IngredientType[];

export type ValidationResult = {
  ingredient: string;
  valid: boolean;
  exists: boolean;
};

export type ValidationResults = ValidationResult[];
