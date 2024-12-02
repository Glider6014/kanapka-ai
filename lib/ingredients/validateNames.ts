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

const forbiddenIngredients = [
  "dog meat",
  "cat meat",
  "human meat",
  "rat meat",
  "toxic",
  "poison",
  "chemical",
  "nuclear",
  "radiation",
  "unicorn",
  "dragon meat",
  "mystical ingredient",
  "random characters",
  "non-food",
];

const forbiddenExamples = forbiddenIngredients
  .map((ingredient) => `"${ingredient}"`)
  .join(", ");

const prompt = ChatPromptTemplate.fromTemplate(`
  Evaluate if the given ingredient is an edible food product. Answer only "true" or "false".

  Ingredient to evaluate: {ingredient}

  Evaluation rules:
  - Answer "true" if the ingredient is:
    * A fruit or vegetable
    * A food product available in stores
    * A spice or herb
    * Meat or fish (e.g. beef, chicken, salmon, etc.)
    * Dairy (e.g. milk, cheese, yogurt, etc.)
    * Grain or its derivative (e.g. wheat, rice, oats, etc.)
    * An ingredient used in cooking (e.g. salt, oil, vinegar, etc.)
    
  - Answer "false" if the ingredient is:
    * Inedible or toxic (e.g. poison, chemical substances, non-food items)
    * A random string of characters
    * A non-food item
    * Does not exist as a food product
    * A controversial or culturally inappropriate food (e.g. dog meat, cat meat, human meat, rat meat, etc.)
    * Any ingredient that is fictional or non-existent as a food (e.g. unicorn meat, dragon meat, etc.)
    
  Examples forbidden ingredients (will always return "false"): {forbiddenExamples}

  Examples:
  - "apple" → true
  - "dog meat" → false
  - "dragon meat" → false
  - "toxic waste" → false
  - "cucumber" → true
  - "human meat" → false
  - "poison" → false
  - "water" → true
`);

const chain = prompt.pipe(model);

export async function validateIngredient(
  ingredient: string
): Promise<ValidationResult> {
  const response = await chain.invoke({ ingredient, forbiddenExamples });
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
