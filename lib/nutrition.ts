export type Nutrition = {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
};

export const emptyNutrition: Nutrition = {
  calories: 0,
  protein: 0,
  fats: 0,
  carbs: 0,
  fiber: 0,
  sugar: 0,
  sodium: 0,
};
