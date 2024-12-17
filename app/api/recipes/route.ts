import { NextRequest, NextResponse } from 'next/server';
import { extractParamsFromURL, processApiHandler } from '@/lib/apiUtils';
import { paginationGetRecipes, paginationRecipesSchema } from './logic';

const MAX_RECIPES = 100;

const handleGET = async (req: NextRequest) => {
  const searchParams = extractParamsFromURL(
    req.nextUrl,
    paginationRecipesSchema
  );

  const validationResult = paginationRecipesSchema.safeParse(searchParams);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid search params', issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const params = validationResult.data;

  params.limit = Math.min(params.limit, MAX_RECIPES);

  const recipesData = await paginationGetRecipes(params);

  return NextResponse.json(recipesData);
};

export const GET = processApiHandler(handleGET);
