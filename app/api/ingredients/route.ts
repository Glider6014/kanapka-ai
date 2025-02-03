import {
  extractParamsFromURLBasedOnSchema,
  processApiHandler,
} from '@/lib/apiUtils';
import { NextRequest, NextResponse } from 'next/server';
import { paginationGetIngredients, paginationIngredientsSchema } from './logic';

const MAX_INGREDIENTS = 100;

const handleGET = async (req: NextRequest) => {
  const searchParams = extractParamsFromURLBasedOnSchema(
    req.nextUrl,
    paginationIngredientsSchema
  );

  const validationResult = paginationIngredientsSchema.safeParse(searchParams);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: 'Invalid search params', issues: validationResult.error.issues },
      { status: 400 }
    );
  }

  const params = validationResult.data;
  params.limit = Math.min(params.limit, MAX_INGREDIENTS);

  const ingredientsData = await paginationGetIngredients(params);

  return NextResponse.json(ingredientsData);
};

export const GET = processApiHandler(handleGET);
