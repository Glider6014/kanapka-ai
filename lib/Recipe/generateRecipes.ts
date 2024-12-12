import agent from "@/lib/recipeAgent/agent";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import Recipe, { RecipeType } from "@/models/Recipe";
import { z } from "zod";
import { StringOutputParser } from "@langchain/core/output_parsers";

interface GenerateRecipesParams {
  ingredients: string[];
  count: number;
  userId: string;
}

export async function* generateRecipes({
  ingredients,
  count,
  userId,
}: GenerateRecipesParams): AsyncGenerator<RecipeType> {
  if (!ingredients || !count) {
    throw new Error("'ingredients' and 'count' are required.");
  }

  const messages = [
    new SystemMessage(
      `You are a helpful assistant that generates recipes using provided ingredients.

Use the available tools ("ingredients_generator" and "recipe_generator") to generate recipes and return their IDs.

The "userId" is "${userId}". When calling "recipe_generator", make sure to include "userId" with this value.

IMPORTANT:
- Respond ONLY with a valid JSON object in the exact format: { "recipeIds": ["id1", "id2", ...] }.
- Do NOT include any additional text, explanations, or formatting.
- Ensure the JSON is properly formatted without any extra characters.

Example of the required format:
{ "recipeIds": ["67572cca8b92375c5a027b43", "67572ccb8b92375c5a027b54"] }`
    ),
    new HumanMessage(
      `I have these ingredients available: ${ingredients.join(", ")}.
Please generate ${count} recipes total, with a good mix of:
- Recipes using only my available ingredients
- Recipes that might require buying a few additional ingredients

For recipes requiring additional ingredients:
1. First use ingredients_generator to create the new ingredients
2. Then use recipe_generator to create the recipe
3. Make sure to track all ingredient IDs carefully

Return the results as: { "recipeIds": ["id1", "id2", ...] }`
    ),
  ];

  const outputSchema = z.object({
    recipeIds: z.array(z.string()),
  });

  const parser = new StringOutputParser();

  try {
    const finalState = await agent.invoke({ messages });
    const { messages: agentMessages } = finalState;
    const lastMessage = agentMessages[agentMessages.length - 1];

    const parsedOutput = await parser.parse(lastMessage.content);
    const validationResult = outputSchema.safeParse(JSON.parse(parsedOutput));

    if (!validationResult.success) {
      throw new Error("Invalid response format from agent.");
    }

    const { recipeIds } = validationResult.data;

    for (const recipeId of recipeIds) {
      const recipe = await Recipe.findById(recipeId);
      if (recipe) {
        yield recipe;
      }
    }
  } catch (error) {
    throw new Error("Failed to generate recipes.");
  }
}
