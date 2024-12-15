import { Schema, Model, model, models, Document } from 'mongoose';
import { unitToFactor } from '@/lib/units';
import '@/models/Ingredient';
import { IngredientType } from '@/models/Ingredient';
import { emptyNutrition, Nutrition } from '@/lib/nutrition';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

const RecipeSchema = new Schema({
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
});

RecipeSchema.set('toJSON', createBaseToJSON());
RecipeSchema.set('toObject', createBaseToObject());

RecipeSchema.methods.calculateNutrition = async function (
  this: Document & RecipeTypeWithPopulatedIngredients
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
      const value = ing.nutrition[key as keyof Nutrition];

      acc[key as keyof Nutrition] += value * factor;
    });

    return acc;
  }, emptyNutrition);

  return nutritionTotals;
};

export type RecipeType = InferBaseSchemaType<typeof RecipeSchema> & {
  calculateNutrition: () => Promise<Nutrition>;
};

export const Recipe =
  (models.Recipe as Model<RecipeType>) ||
  model<RecipeType>('Recipe', RecipeSchema);

// <-- Additional populated types -->

type PopulatedRecipeIngredient = {
  ingredient: IngredientType;
  amount: number;
};

export type RecipeTypeWithPopulatedIngredients = Omit<
  RecipeType,
  'ingredients'
> & {
  ingredients: PopulatedRecipeIngredient[];
};
