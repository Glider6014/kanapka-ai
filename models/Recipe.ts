import {
  Schema,
  InferSchemaType,
  Model,
  model,
  models,
  Document,
} from 'mongoose';
import { NutritionTotals } from '../types/NutritionTotals';
import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { unitToFactor } from '@/lib/units';
import '@/models/Ingredient';
import { IngredientType } from '@/models/Ingredient';
import { emptyNutrition } from '@/lib/nutrition';

const RecipeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient',
          required: true,
        },
        amount: { type: Number, required: true },
      },
    ],
    steps: [{ type: String, required: true }],
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
      default: 'Easy',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  {
    ...schemaOptionsSwitchToId,
  }
);

type PopulatedRecipeIngredient = {
  ingredient: IngredientType;
  amount: number;
};

RecipeSchema.methods.calculateNutrition = async function (
  this: Document &
    Omit<RecipeType, 'ingredients'> & {
      ingredients: PopulatedRecipeIngredient[];
    }
) {
  if (!this.populated('ingredients.ingredient')) {
    await this.populate('ingredients.ingredient');
  }

  const ingredients = this.ingredients.map((ing) => ({
    nutrition: ing.ingredient.nutrition,
    unit: ing.ingredient.unit,
    amount: ing.amount,
  }));

  const nutritionTotals = ingredients.reduce((acc, ing) => {
    const factor = ing.amount / unitToFactor[ing.unit];

    Object.keys(ing.nutrition).forEach((key) => {
      acc[key as keyof NutritionTotals] +=
        ing.nutrition[key as keyof NutritionTotals] * factor;
    });

    return acc;
  }, emptyNutrition);

  return nutritionTotals;
};

export type RecipeType = InferSchemaType<typeof RecipeSchema> &
  withId & {
    calculateNutrition(): Promise<NutritionTotals>;
  };

const Recipe =
  (models.Recipe as Model<RecipeType>) ||
  model<RecipeType>('Recipe', RecipeSchema);

export default Recipe;
