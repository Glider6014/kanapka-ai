import { NextRequest, NextResponse } from "next/server";
import { generateRecipes } from "@/lib/Recipe/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";
import { RecipeType } from "@/models/Recipe";
import Fridge from "@/models/Fridge";
import { validateIngredients } from "@/lib/ingredients/validateNames";

export const POST = withApiErrorHandling(async (req: NextRequest) => {
  await connectDB();
  const session = await getServerSessionOrCauseUnathorizedError();

  const body = await req.json().catch(() => null);

  if (!body) {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const { ingredients, count }: { ingredients: string[]; count: number } = body;

  if (!ingredients?.length || !count) {
    return new Response(
      JSON.stringify({ error: "'ingredients' and 'count' are required." }),
      { status: 400 }
    );
  }

  // First validate all ingredients
  const validationResults = await validateIngredients(ingredients);
  const invalidIngredients = validationResults.filter((r) => !r.isValid);

  if (invalidIngredients.length > 0) {
    return new Response(
      JSON.stringify({
        error: "Some ingredients are invalid",
        invalidIngredients: invalidIngredients.map((r) => r.ingredient),
      }),
      { status: 400 }
    );
  }

  // Validate ingredients against fridge contents
  const missingIngredients = await Fridge.validateUserIngredients(
    ingredients,
    session.user.id
  );
  if (missingIngredients.length > 0) {
    return new Response(
      JSON.stringify({
        error: `Missing ingredients in your fridges`,
        code: "MISSING_INGREDIENTS",
        missingIngredients,
      }),
      { status: 422 }
    );
  }

  const encoder = new TextEncoder();
  const recipeGenerator = generateRecipes({
    ingredients,
    count,
    userId: session.user.id,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const recipe of recipeGenerator) {
          const recipeData: RecipeType = {
            _id: recipe._id,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            difficulty: recipe.difficulty,
            createdBy: recipe.createdBy,
            createdAt: recipe.createdAt,
            calculateNutrition: recipe.calculateNutrition.bind(recipe),
          };

          const chunk = JSON.stringify(recipeData, (key, value) => {
            // Skip function serialization
            if (typeof value === "function") return undefined;
            return value;
          });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }
      } catch (error) {
        console.error("Stream error:", error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error: "Failed to generate recipes",
            })}\n\n`
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
});
