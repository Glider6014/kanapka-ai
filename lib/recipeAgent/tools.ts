import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { generateIngredient } from '@/lib/ingredients/generateIngredients';
import { generateRecipeFromIds } from '@/lib/Recipe/generateRecipeFromIds';
import connectDB from '../connectToDatabase';
import { MealSchedule } from '../../models/MealSchedule';
import { Types } from 'mongoose';
import { Nutrition } from '../nutrition';

export interface Ingredient {
  id: string;
  name: string;
  unit: 'g' | 'ml' | 'piece';
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
  nutrition: Nutrition;
}

export const ingredientsGenerator = tool(
  async ({ ingredientNames }: { ingredientNames: string }): Promise<string> => {
    if (!ingredientNames?.trim()) {
      throw new Error(
        'No ingredients provided. Please specify ingredient names.'
      );
    }

    console.log('Dodawanie składników do bazy...');

    const ingredientList = ingredientNames
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (ingredientList.length === 0) {
      throw new Error('No valid ingredients found in the provided input.');
    }

    console.log('Ingredients Name ' + ingredientList);

    const generatedIngredients = await Promise.all(
      ingredientList.map(async (name) => {
        const ingredient = await generateIngredient(name);
        if (ingredient && ingredient.nutrition) {
          return {
            id: ingredient.id,
            name: ingredient.name,
            unit: ingredient.unit,
            nutrition: ingredient.nutrition,
          };
        }
        return null;
      })
    );

    console.log('generatedIngredients', generatedIngredients);
    return JSON.stringify(generatedIngredients.filter((ing) => ing));
  },
  {
    name: 'ingredients_generator',
    description: `Adds ingredients to the database from comma-separated names. 
Input format: "ingredient1, ingredient2, ingredient3"
Example: "chicken, rice, tomato"
Returns: Array of ingredients with their IDs (id field) that you'll need for recipe generation.
IMPORTANT: Save the id values as you'll need them for recipe_generator!`,
    schema: z.object({
      ingredientNames: z
        .string()
        .describe(
          "Comma-separated list of ingredient names (e.g., 'chicken, rice, tomato')"
        ),
    }),
  }
);

export const recipeGenerator = tool(
  async ({
    recipeName,
    ingredientIds,
    userId,
  }: {
    recipeName: string;
    ingredientIds: string;
    userId: string;
  }): Promise<string> => {
    if (!recipeName?.trim()) {
      throw new Error('Recipe name is required.');
    }
    console.log('Generowanie, przepisu...');

    if (!ingredientIds?.trim()) {
      throw new Error('Ingredient IDs are required.');
    }

    const idsList = ingredientIds.split(',').map((id) => id.trim());

    if (idsList.length === 0) {
      throw new Error('No valid ingredient IDs provided.');
    }

    const recipe = await generateRecipeFromIds(recipeName, idsList, userId);

    if (!recipe) {
      return '';
    }

    console.log('RecipeName, ingredientIds');
    console.log(recipeName, ingredientIds);

    return JSON.stringify({ recipeId: recipe.id });
  },
  {
    name: 'recipe_generator',
    description: `Creates a recipe using ingredient IDs from ingredients_generator.
Required parameters:
1. recipeName: Name of the recipe you want to create
2. ingredientIds: Comma-separated list of ingredient id values from ingredients_generator

Example:
- recipeName: "Chicken Rice Bowl"
- ingredientIds: "507f1f77bcf86cd799439011, 507f1f77bcf86cd799439012"

IMPORTANT: Use the exact id values returned by ingredients_generator!`,
    schema: z.object({
      recipeName: z
        .string()
        .describe("Name of the recipe to generate (e.g., 'Chicken Rice Bowl')"),
      ingredientIds: z
        .string()
        .describe(
          'Comma-separated list of ingredient id values from ingredients_generator'
        ),
      userId: z
        .string()
        .describe('User ID for whom the recipe is being generated'),
    }),
  }
);

export const mealScheduler = tool(
  async ({
    meals,
    userId,
    targetDate,
  }: {
    meals: string;
    userId: string;
    targetDate: string;
  }): Promise<string> => {
    if (!meals?.trim()) {
      throw new Error(
        'No meals provided for scheduling. Format: recipeId@time, recipeId@time, ...'
      );
    }

    console.log('Planowanie przepisów...');
    try {
      await connectDB();
      const baseDate = new Date(targetDate);

      const schedules: MealSchedule[] = meals.split(',').map((meal) => {
        const [recipeId, time] = meal.trim().split('@');

        if (!recipeId?.trim() || !time?.trim()) {
          throw new Error(
            `Invalid meal format in: ${meal}. Expected format: recipeId@time`
          );
        }

        return { recipeId: recipeId.trim(), time: time.trim() };
      });

      if (schedules.length === 0) {
        throw new Error('No valid meal schedules provided.');
      }

      const savedSchedules = await Promise.all(
        schedules.map((schedule) => {
          const [hours, minutes] = schedule.time.split(':').map(Number);
          const scheduledDate = new Date(baseDate);
          scheduledDate.setHours(hours, minutes, 0, 0);

          return MealSchedule.create({
            userId: new Types.ObjectId(userId),
            recipeId: new Types.ObjectId(schedule.recipeId),
            date: scheduledDate,
          });
        })
      );

      return JSON.stringify({
        message: 'Successfully scheduled meals',
        schedules: savedSchedules,
      });
    } catch (error) {
      console.error('Error scheduling meals:', error);
      throw error;
    }
  },
  {
    name: 'meal_scheduler',
    description: `Schedules meals throughout the day using recipe IDs.
Input format: "recipeId@time, recipeId@time"
Example: "507f1f77bcf86cd799439011@8:00, 507f1f77bcf86cd799439012@12:00"

IMPORTANT: 
- Use the recipe.id values returned by recipe_generator
- Time should be in HH:MM format
- Separate multiple meals with commas
- Date should be in YYYY-MM-DD format`,
    schema: z.object({
      meals: z
        .string()
        .describe(
          "Comma-separated list of 'recipeId@time' pairs (e.g., 'recipeId@8:00, recipeId@12:00')"
        ),
      userId: z
        .string()
        .describe('User ID for whom the meals are being scheduled'),
      targetDate: z.string().describe('Target date in YYYY-MM-DD format'),
    }),
  }
);

export const tools = [ingredientsGenerator, recipeGenerator, mealScheduler];
