import connectDB from '@/lib/connectToDatabase';
import { Recipe, RecipeType } from '@/models/Recipe';
import { z } from 'zod';
import { isRegexPattern } from '@/lib/utils';
import mongoose from 'mongoose';

export const paginationRecipesSchema = z.object({
  // Pagination
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).default(20),

  // Sorting
  sortBy: z.enum(['name', 'createdAt', 'difficulty', 'steps']).optional(),
  order: z.union([z.literal(-1), z.literal(1)]).default(1),

  // Filters
  name: z
    .string()
    .refine((s) => isRegexPattern(s), 'Invalid name regex pattern')
    .optional(),
  ingredients: z
    .array(z.string())
    .refine(
      (arr) => arr.every((s) => mongoose.isValidObjectId(s)),
      'Invalid ingredient ID'
    )
    .optional(),
  difficulty: z.array(z.string()).optional(),
  createdBy: z.string().optional(),
  createdBefore: z.date().optional(),
  createdAfter: z.date().optional(),
});

export type PaginationRecipesInput = z.infer<typeof paginationRecipesSchema>;

function createQuery(params: PaginationRecipesInput) {
  const query = Recipe.find();

  query.skip(params.offset);
  query.limit(params.limit);

  if (params.sortBy) query.sort({ [params.sortBy]: params.order || 1 });

  if (params.name) query.where('name').regex(params.name);

  if (params.ingredients?.length)
    for (const ingredient of params.ingredients) {
      query.where('ingredients.ingredient').in([ingredient]);
    }

  if (params.difficulty?.length)
    query.where('difficulty').in(params.difficulty);

  if (params.createdBy) query.where('createdBy').equals(params.createdBy);

  if (params.createdBefore)
    query.where('createdAt').lte(params.createdBefore.getTime());

  if (params.createdAfter)
    query.where('createdAt').gte(params.createdAfter.getTime());

  return query;
}

export type PaginationRecipesOutput = {
  count: number;
  results: RecipeType[];
  offset: number;
  limit: number;
};

export const paginationGetRecipes = async (params: PaginationRecipesInput) => {
  await connectDB();

  const itemsQuery = createQuery(params);
  const countQuery = Recipe.find(itemsQuery.getQuery());

  const [results, count] = await Promise.all([
    itemsQuery.lean().exec(),
    countQuery.countDocuments(),
  ]);

  return {
    count,
    results,
    offset: params.offset,
    limit: params.limit,
  } as PaginationRecipesOutput;
};
