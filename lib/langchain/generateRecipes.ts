import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";
import Ingredient, { IngredientType } from "@/models/Ingredient";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromTemplate(`
Create {count} recipe(s) using the following ingredients as much as possible.

Ingredients the user has: {ingredients}

Each recipe should:
- Use as many of the provided ingredients as possible.
- Require as few additional ingredients as possible.
- Conform to the Recipe model.

Respond ONLY with a valid JSON array string in this exact format (no other text):
[
  {{
    "name": "[Recipe name]",
    "description": "[Description]",
    "ingredients": [
      {{
        "name": "[Ingredient name]",
        "amount": [number]
      }}
    ],
    "steps": ["[Step 1]", "[Step 2]", "..."],
    "prepTime": [number],
    "cookTime": [number],
    "difficulty": "[Easy/Medium/Hard]",
    "experience": [number]
  }}
]
`);

const chain = prompt.pipe(model);

async function validateGeneratedIngredient(genIng: any) {
  console.log(genIng);

  if (!genIng.name || !genIng.amount) return;

  if (genIng.amount <= 0) return;

  await connectDB();
  const ingredient = await Ingredient.findOne({
    name: genIng.name.toLowerCase(),
  });

  if (!ingredient) return;

  return ingredient;
}

async function validateRecipe(recipeData: any) {
  if (
    !recipeData.name ||
    !recipeData.description ||
    !recipeData.ingredients ||
    !recipeData.steps ||
    !recipeData.prepTime ||
    !recipeData.cookTime ||
    !recipeData.difficulty ||
    !recipeData.experience
  )
    return;

  if (!Array.isArray(recipeData.ingredients)) return;

  let ingredients;

  try {
    ingredients = await Promise.all(
      recipeData.ingredients.map(async (ing: any) => {
        const ingredient = await validateGeneratedIngredient(ing);

        if (!ingredient) throw new Error("Invalid generated ingredient");

        return {
          ingredient: ingredient._id,
          amount: ing.amount,
        };
      })
    );
  } catch (error) {
    console.error("Error validating generated ingredients:", error);
    return;
  }

  const recipe = new Recipe({
    name: recipeData.name,
    description: recipeData.description,
    ingredients,
    steps: recipeData.steps,
    prepTime: recipeData.prepTime,
    cookTime: recipeData.cookTime,
    difficulty: recipeData.difficulty,
    experience: recipeData.experience,
  });

  return recipe;
}

export async function generateRecipes(
  ingredients: IngredientType[],
  recipesCount: number = 5
) {
  await connectDB();

  try {
    const ingredientsAsString = ingredients
      .map((i) => `${i.name} in ${i.unit}s`)
      .join(", ");

    const response = await chain.invoke({
      ingredients: ingredientsAsString,
      count: recipesCount,
    });

    const generatedRecipes = JSON.parse(response.content.toString());

    const recipes = (
      await Promise.all(generatedRecipes.map(validateRecipe))
    ).filter(Boolean);

    return recipes;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
