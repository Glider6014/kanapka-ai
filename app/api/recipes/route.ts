import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/connectToDatabase';
import { Recipe, RecipeType } from '@/models/Recipe';
import { z } from 'zod';
import { processApiHandler } from '@/lib/apiUtils';

const GetRecipesSchema = z.object({
  // Pagination
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).max(100).default(20),

  // Sorting
  sortBy: z.enum(['name', 'createdAt', 'difficulty', 'steps']).optional(),
  order: z.union([z.literal(-1), z.literal(1)]).default(1),

  // Filters
  ingredients: z
    .preprocess((val) => {
      if (typeof val === 'string') return val.split(',');
      if (Array.isArray(val)) return val;
      return [];
    }, z.array(z.string()))
    .optional(),
  difficulty: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  createdBefore: z.date().optional(),
  createdAfter: z.date().optional(),
});

export type GetRecipesSchemaType = z.infer<typeof GetRecipesSchema>;

export type GetRecipesResponse = {
  count: number;
  results: RecipeType[];
  offset: number;
  limit: number;
};

function createQuery(params: GetRecipesSchemaType) {
  const query = Recipe.find();

  query.skip(params.offset);
  query.limit(params.limit);

  if (params.sortBy) query.sort({ [params.sortBy]: params.order });

  if (params.ingredients?.length)
    query.where('ingredients.ingredient').in(params.ingredients);

  if (params.difficulty?.length)
    query.where('difficulty').in(params.difficulty);

  if (params.createdBy) query.where('createdBy').equals(params.createdBy);

  if (params.createdBefore)
    query.where('createdAt').lte(params.createdBefore.getTime());

  if (params.createdAfter)
    query.where('createdAt').gte(params.createdAfter.getTime());

  return query;
}

const handleGET = async (req: NextRequest) => {
  await connectDB();

  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const params = GetRecipesSchema.parse(searchParams);

  const itemsQuery = createQuery(params);
  const countQuery = Recipe.find(itemsQuery.getQuery());

  const recipes = await itemsQuery.exec();
  const count = await countQuery.countDocuments();

  const response: GetRecipesResponse = {
    count,
    results: recipes,
    offset: params.offset,
    limit: params.limit,
  };

  return NextResponse.json(response);
};

export const GET = processApiHandler(handleGET);
