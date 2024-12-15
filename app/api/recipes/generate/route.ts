import { NextRequest, NextResponse } from 'next/server';
import { generateRecipes } from '@/lib/Recipe/generateRecipes';
import connectDB from '@/lib/connectToDatabase';
import { getServerSessionProcessed, processApiHandler } from '@/lib/apiUtils';
import { RecipeType } from '@/models/Recipe';
import { Fridge } from '@/models/Fridge';
import { validateIngredients } from '@/lib/ingredients/validateNames';
import { RecipeGeneratorHistory } from '@/models/RecipeGeneratorHistory';
import { UserSubscription } from '@/lib/subscriptions';

const handlePOST = async (req: NextRequest) => {
  await connectDB();
  const session = await getServerSessionProcessed();

  if (session.user.subscriptionType === UserSubscription.FREE) {
    const useCountFromLast24Hours = await RecipeGeneratorHistory.countDocuments(
      {
        createdBy: session.user.id,
        createdAt: {
          $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 24 hours ago
        },
      }
    );

    if (useCountFromLast24Hours >= 10) {
      return NextResponse.json(
        {
          error:
            'You have reached your free daily limit of 10 recipes. Upgrade to plus for unlimited access.',
        },
        {
          status: 422,
        }
      );
    }
  }

  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      {
        status: 400,
      }
    );
  }

  const { ingredients, count }: { ingredients: string[]; count: number } = body;

  if (!ingredients?.length || !count) {
    return NextResponse.json(
      { error: "'ingredients' and 'count' are required." },
      { status: 400 }
    );
  }

  // First validate all ingredients
  const validationResults = await validateIngredients(ingredients);
  const invalidIngredients = validationResults.filter((r) => !r.isValid);

  if (invalidIngredients.length > 0) {
    return NextResponse.json(
      {
        error: 'Some ingredients are invalid',
        invalidIngredients: invalidIngredients.map((r) => r.ingredient),
      },
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
            id: recipe.id,
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
            if (typeof value === 'function') return undefined;
            return value;
          });
          controller.enqueue(encoder.encode(`data: ${chunk}\n\n`));
        }

        await RecipeGeneratorHistory.create({
          createdBy: session.user.id,
          ingredients: ingredients,
        });
      } catch (error) {
        console.error('Stream error:', error);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              error: 'Failed to generate recipes',
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
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
};

export const POST = processApiHandler(handlePOST);
