import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { generateIngredient } from "@/lib/Ingredients/generateIngredeints";
import { generateRecipeFromIds } from "@/lib/Recipe/generateRecipeFromIds";
import { NutritionTotals } from "@/types/NutritionTotals";

export interface Ingredient {
  _id: string; // Add _id field
  name: string;
  unit: "g" | "ml" | "piece";
  nutrition: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
}

interface MealSchedule {
  recipeId: string;
  time: string;
}

export interface Recipe {
  id: string;
  name: string;
  nutrition: NutritionTotals;
}

export const ingredientsGenerator = tool(
  async ({
    ingredientNames,
  }: {
    ingredientNames: string;
  }): Promise<Ingredient[]> => {
    if (!ingredientNames?.trim()) {
      throw new Error(
        "No ingredients provided. Please specify ingredient names."
      );
    }

    const ingredientList = ingredientNames
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (ingredientList.length === 0) {
      throw new Error("No valid ingredients found in the provided input.");
    }

    console.log("Ingredients Name" + ingredientList);

    const generatedIngredients = await Promise.all(
      ingredientList.map(async (name) => {
        const ingredient = await generateIngredient(name);
        if (ingredient && ingredient.nutrition) {
          return {
            _id: ingredient._id.toString(), // Include the ID
            name: ingredient.name,
            unit: ingredient.unit,
            nutrition: ingredient.nutrition,
          };
        }
        return null;
      })
    );
    console.log("generatedIngredients", generatedIngredients);
    return generatedIngredients.filter(
      (ingredient): ingredient is Ingredient => ingredient !== null
    );
  },
  {
    name: "ingredients_generator",
    description:
      "Generates list of available ingredients from comma-separated ingredient names",
    schema: z.object({
      ingredientNames: z
        .string()
        .describe("Comma-separated list of ingredient names"),
    }),
  }
);

export const recipeGenerator = tool(
  async ({
    recipeName,
    ingredientIds,
  }: {
    recipeName: string;
    ingredientIds: string;
  }): Promise<Recipe | null> => {
    if (!recipeName?.trim()) {
      throw new Error("Recipe name is required.");
    }

    if (!ingredientIds?.trim()) {
      throw new Error("Ingredient IDs are required.");
    }

    const idsList = ingredientIds.split(",").map((id) => id.trim());

    if (idsList.length === 0) {
      throw new Error("No valid ingredient IDs provided.");
    }

    const recipe = await generateRecipeFromIds(recipeName, idsList);

    if (!recipe) {
      return null;
    }

    console.log("RecipeName, ingredientIds");
    console.log(recipeName, ingredientIds);

    const nutrition = await recipe.calculateNutrition();

    return {
      id: recipe._id.toString(),
      name: recipe.name,
      nutrition,
    };
  },
  {
    name: "recipe_generator",
    description: "Creates a recipe from a name and list of ingredient IDs",
    schema: z.object({
      recipeName: z.string().describe("Name of the recipe to generate"),
      ingredientIds: z
        .string()
        .describe("Comma-separated list of ingredient IDs"),
    }),
  }
);

export const mealScheduler = tool(
  async ({ meals }: { meals: string }): Promise<void> => {
    if (!meals?.trim()) {
      throw new Error(
        "No meals provided for scheduling. Format: recipeId@time, recipeId@time, ..."
      );
    }

    try {
      const schedules: MealSchedule[] = meals.split(",").map((meal) => {
        const [recipeId, time] = meal.trim().split("@");

        if (!recipeId?.trim() || !time?.trim()) {
          throw new Error(
            `Invalid meal format in: ${meal}. Expected format: recipeId@time`
          );
        }

        return { recipeId: recipeId.trim(), time: time.trim() };
      });

      if (schedules.length === 0) {
        throw new Error("No valid meal schedules provided.");
      }

      console.log("Scheduled meals:");
      schedules.forEach(({ recipeId, time }) => {
        console.log(`Recipe ID: ${recipeId} scheduled for: ${time}`);
      });

      return Promise.resolve();
    } catch (error) {
      console.error("Error scheduling meals:", error);
      throw error;
    }
  },
  {
    name: "meal_scheduler",
    description:
      "Schedules meals throughout the day. Format: 'recipeId@time, recipeId@time, ...'",
    schema: z.object({
      meals: z
        .string()
        .describe(
          "Comma-separated list of recipe IDs with times (format: recipeId@time)"
        ),
    }),
  }
);

export const tools = [ingredientsGenerator, recipeGenerator, mealScheduler];
