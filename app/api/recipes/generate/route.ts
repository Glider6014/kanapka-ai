import { NextRequest, NextResponse } from "next/server";
import { generateRecipes } from "@/lib/Recipe/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { generateIngredient } from "@/lib/ingredients/generateIngredients";
import { validateIngredient } from "@/lib/ingredients/validateNames";
import mongoose from "mongoose";
import RecipeModel from "@/models/Recipe";
import {
  getServerSessionOrCauseUnathorizedError,
  withApiErrorHandling,
} from "@/lib/apiUtils";

export const POST = withApiErrorHandling(async (req: NextRequest) => {
  await connectDB();

  const session = await getServerSessionOrCauseUnathorizedError();

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { ingredients: ingredientsInput, count } = body;

  if (!ingredientsInput || !count) {
    return NextResponse.json(
      { error: "'ingredients' and 'count' are required" },
      { status: 400 }
    );
  }

  // Split ingredients string into array and process each ingredient
  const ingredientsList = ingredientsInput
    .toString()
    .split(",")
    .map((i: string) => i.trim());

  // Validate ingredients before processing
  const validationResults = await Promise.all(
    ingredientsList.map(validateIngredient)
  );

  const invalidIngredients = validationResults.filter(
    (result) => !result.isValid
  );
  if (invalidIngredients.length > 0) {
    return NextResponse.json(
      {
        error: `Invalid ingredients detected: ${invalidIngredients
          .map((i) => i.ingredient)
          .join(", ")}`,
      },
      { status: 400 }
    );
  }

  const generatedIngredients = await Promise.all(
    ingredientsList.map(async (ingredientName: string) => {
      const ingredient = await generateIngredient(ingredientName);
      if (!ingredient) {
        throw new Error(`Failed to generate ingredient: ${ingredientName}`);
      }
      return ingredient;
    })
  );

  if (!generatedIngredients.length) {
    return NextResponse.json(
      { error: "No ingredients could be generated" },
      { status: 400 }
    );
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const recipeGenerator = generateRecipes(generatedIngredients, count);

      for await (const recipeData of recipeGenerator) {
        try {
          const recipe = new RecipeModel(recipeData);
          recipe.createdBy = new mongoose.Types.ObjectId(session.user.id);
          await recipe.save();
          await recipe.populate("ingredients.ingredient");

          const chunk = encoder.encode(JSON.stringify({ recipe }) + "\n");
          await writer.write(chunk);
        } catch (error) {
          console.error("Error processing recipe:", error);
          const errorChunk = encoder.encode(
            JSON.stringify({ error: "Failed to process recipe" }) + "\n"
          );
          await writer.write(errorChunk);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      const errorChunk = encoder.encode(
        JSON.stringify({ error: "Recipe generation failed" }) + "\n"
      );
      await writer.write(errorChunk);
    } finally {
      try {
        await writer.close();
      } catch (error) {
        console.error("Error closing writer:", error);
      }
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
});
