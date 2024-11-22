export type ValidationInput = {
  ingredients: string | string[];
};

export type ValidationResponse = {
  results: ValidationItemResult[];
  validIngredients: string[];
};

export type ValidationItemResult = {
  ingredient: string;
  valid: boolean;
  exists: boolean;
};
