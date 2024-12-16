import { processApiHandler } from '@/lib/apiUtils';
import connectDB from '@/lib/connectToDatabase';
import { unitsList } from '@/lib/units';
import { Ingredient, IngredientType } from '@/models/Ingredient';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_INGREDIENTS = 100;

const nutritionSchema = z.object({
  calories: z.coerce.number().int().min(0).optional(),
  protein: z.coerce.number().int().min(0).optional(),
  fats: z.coerce.number().int().min(0).optional(),
  carbs: z.coerce.number().int().min(0).optional(),
  fiber: z.coerce.number().int().min(0).optional(),
  sugar: z.coerce.number().int().min(0).optional(),
  sodium: z.coerce.number().int().min(0).optional(),
});

const getIngredientsSchema = z.object({
  // Pagination
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).max(MAX_INGREDIENTS).default(20),

  // Sorting
  sortBy: z.enum(['name']).optional(),
  order: z.union([z.literal(-1), z.literal(1)]).default(1),

  // Filters
  nameRegex: z.string().optional(),
  units: z.array(z.enum(unitsList)).optional(),
  nutritionUnder: nutritionSchema.optional(),
  nutritionOver: nutritionSchema.optional(),
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

  if (params.sortBy) query.sort({ [params.sortBy]: params.order });

  if (params.nameRegex) query.where('name').regex(params.nameRegex);

  if (params.units?.length) query.where('unit').in(params.units);

  if (params.nutritionUnder) {
    for (const [key, value] of Object.entries(params.nutritionUnder)) {
      query.where(`nutrition.${key}`).lte(value);
    }
  }

  if (params.nutritionOver) {
    for (const [key, value] of Object.entries(params.nutritionOver)) {
      query.where(`nutrition.${key}`).gte(value);
    }
  }

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
