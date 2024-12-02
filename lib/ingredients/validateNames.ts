// validateIngredients.ts

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type ValidationResult = {
  ingredient: string;
  isValid: boolean;
};

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  openAIApiKey: process.env.OPENAI_API_KEY,
  stop: ["\n", " "],
});

const prompt = ChatPromptTemplate.fromTemplate(`
  Evaluate if the given ingredient is an edible food product. Answer only "true" or "false".

  Ingredient to evaluate: {ingredient}

  Evaluation rules:
  - Answer "true" if the ingredient is:
    * A fruit or vegetable
    * A food product available in stores
    * A spice or herb
    * Meat or fish
    * Dairy
    * Grain or its derivative
    * An ingredient used in cooking
    
  - Answer "false" if the ingredient is:
    * Inedible or toxic
    * A random string of characters
    * A non-food item
    * Does not exist as a food product
`);

const chain = prompt.pipe(model);

export async function validateIngredient(
  ingredient: string
): Promise<ValidationResult> {
  const response = await chain.invoke({ ingredient });
  console.log(ingredient, response.content === "true");
  return {
    ingredient,
    isValid: response.content === "true",
  };
}

export async function validateIngredients(
  ingredients: string[]
): Promise<ValidationResult[]> {
  return Promise.all(ingredients.map(validateIngredient));
}
