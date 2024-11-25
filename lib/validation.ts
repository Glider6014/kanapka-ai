import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import Ingredient from "@/models/Ingredient";
import connectDB from "@/lib/connectToDatabase";

// Initialize the language model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Define the prompt template
const validationPrompt = ChatPromptTemplate.fromTemplate(`
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
    
    Examples:
    "banana": true
    "apple": true
    "salt": true
    "chicken": true
    "XKCD123": false
    "stone": false
    "dirt": false
    "poison": false
    
    Answer only "true" or "false".
    `);

// Create the validation chain
const validationChain = validationPrompt.pipe(model);

// Function to validate if an ingredient is food
export async function isValidFood(ingredient: string): Promise<boolean> {
  try {
    const result = await validationChain.invoke({ ingredient });
    return result.content.toString().toLowerCase().includes("true");
  } catch (error) {
    console.error(`Validation failed for ingredient "${ingredient}":`, error);
    return false; // Fail safe - if validation fails, assume ingredient is invalid
  }
}

// Function to check if an ingredient exists in the database
export async function findExistingIngredient(name: string) {
  await connectDB();
  return await Ingredient.findOne({ name: { $regex: new RegExp(name, "i") } });
}
