import { processApiHandler } from '@/lib/apiUtils';
import connectDB from '@/lib/connectToDatabase';
import { unitsList } from '@/lib/units';
import { isRegexPattern } from '@/lib/utils';
import { Ingredient, IngredientType } from '@/models/Ingredient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_INGREDIENTS = 100;

const getIngredientsSchema = z.object({
  // Pagination
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).max(MAX_INGREDIENTS).default(20),

  // Sorting
  sortBy: z.enum(['name']).optional(),
  order: z.union([z.literal(-1), z.literal(1)]).default(1),

  // Filters
  name: z.string().refine((name) => isRegexPattern(name), 'Invalid name regex pattern').optional(),
  unit: z.enum(unitsList).optional(),
});

export type GetIngredientsSchemaType = z.infer<typeof getIngredientsSchema>;

export type GetIngredientsResponse = {
  count: number;
  results: IngredientType[];
  offset: number;
  limit: number;
};

function createQuery(params: GetIngredientsSchemaType) {
  const query = Ingredient.find();

  query.skip(params.offset);
  query.limit(params.limit);

  if (params.sortBy) query.sort({ [params.sortBy]: params.order || 1 });

  if (params.name) query.where('name').regex(params.name);

  if (params.unit) query.where('unit').equals(params.unit);

  return query;
}

const handleGET = async (req: NextRequest) => {
  await connectDB();

  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const params = getIngredientsSchema.parse(searchParams);

  const itemsQuery = createQuery(params);
  const countQuery = Ingredient.find(itemsQuery.getQuery());

  const ingredients = await itemsQuery.exec();
  const count = await countQuery.countDocuments();

  const response: GetIngredientsResponse = {
    count,
    results: ingredients,
    offset: params.offset,
    limit: params.limit,
  };

  return NextResponse.json(response);
};

export const GET = processApiHandler(handleGET);
