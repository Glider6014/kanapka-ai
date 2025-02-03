import connectDB from '@/lib/connectToDatabase';
import { unitsList } from '@/lib/units';
import { isRegexPattern } from '@/lib/utils';
import { Ingredient, IngredientType } from '@/models/Ingredient';
import { z } from 'zod';

export const paginationIngredientsSchema = z.object({
  // Pagination
  offset: z.coerce.number().int().nonnegative().default(0),
  limit: z.coerce.number().int().min(1).default(20),

  // Sorting
  sortBy: z.enum(['name']).optional(),
  order: z.union([z.literal(-1), z.literal(1)]).default(1),

  // Filters
  name: z
    .string()
    .refine((name) => isRegexPattern(name), 'Invalid name regex pattern')
    .optional(),
  unit: z.enum(unitsList).optional(),
});

export type PaginationIngredientsInput = z.infer<
  typeof paginationIngredientsSchema
>;

export type PaginationIngredientsOutput = {
  count: number;
  results: IngredientType[];
  offset: number;
  limit: number;
};

function createQuery(params: PaginationIngredientsInput) {
  const query = Ingredient.find();

  query.skip(params.offset);
  query.limit(params.limit);

  if (params.sortBy) query.sort({ [params.sortBy]: params.order || 1 });

  if (params.name) query.where('name').regex(params.name);

  if (params.unit) query.where('unit').equals(params.unit);

  return query;
}

export const paginationGetIngredients = async (
  params: PaginationIngredientsInput
) => {
  await connectDB();

  const itemsQuery = createQuery(params);
  const countQuery = Ingredient.find(itemsQuery.getQuery());

  const [results, count] = await Promise.all([
    itemsQuery.lean().exec(),
    countQuery.countDocuments(),
  ]);

  return {
    count,
    results,
    offset: params.offset,
    limit: params.limit,
  };
};
