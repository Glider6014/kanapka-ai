export type IngredientInput = {
  ingredient: string;
};

export type IngredientAnalysisResult = {
  name: string;
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
};
