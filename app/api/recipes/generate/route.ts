import { NextRequest, NextResponse } from "next/server";
import { generateRecipes } from "@/lib/Recipe/generateRecipes";
import connectDB from "@/lib/connectToDatabase";
import { getServerSessionProcessed, processApiHandler } from "@/lib/apiUtils";
import { RecipeType } from "@/models/Recipe";

const handlePOST = async (req: NextRequest) => {
  await connectDB();
  const session = await getServerSessionProcessed();

  const body = await req.json().catch(() => null);

  if (!body) {
    return new NextResponse(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
    });
  }

  const { ingredients, count }: { ingredients: string[]; count: number } = body;

  if (!ingredients?.length || !count) {
    return new NextResponse(
      JSON.stringify({ error: "'ingredients' and 'count' are required." }),
      { status: 400 }
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

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
};

export const POST = processApiHandler(handlePOST);
