import { Schema, InferSchemaType, Model, model, models } from 'mongoose';
import Ingredient from './Ingredient';
import { NutritionTotals } from '../types/NutritionTotals';
import calculateFactor from '@/lib/ingredients/calculateFactor';
import { Unit } from '../types/Unit';

type RecipeIngredient = {
  ingredient: Schema.Types.ObjectId;
  amount: number;
};

const RecipeSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
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

RecipeSchema.methods.calculateNutrition =
  async function calculateNutrition(): Promise<NutritionTotals> {
    const ingredientIds = this.ingredients.map(
      (i: RecipeIngredient) => i.ingredient
    );
    const ingredients = await Ingredient.find({ _id: { $in: ingredientIds } });

    const nutritionTotals: NutritionTotals = {
      calories: 0,
      protein: 0,
      fats: 0,
      carbs: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    };

    this.ingredients.forEach((recipeIngredient: RecipeIngredient) => {
      const ingredient = ingredients.find((ing) =>
        ing.id.equals(recipeIngredient.ingredient.toString())
      );
      if (ingredient) {
        const factor = calculateFactor(
          ingredient.unit as Unit,
          recipeIngredient.amount
        );
        if (ingredient.nutrition) {
          updateNutritionTotals(nutritionTotals, ingredient.nutrition, factor);
        }
      }
    });

    return nutritionTotals;
  };

function updateNutritionTotals(
  nutritionTotals: NutritionTotals,
  nutrition: NutritionTotals,
  factor: number
): void {
  Object.keys(nutritionTotals).forEach((key) => {
    if (nutrition) {
      nutritionTotals[key as keyof NutritionTotals] +=
        nutrition[key as keyof NutritionTotals] * factor;
    }
  });
}

// Update the RecipeType to use the method interface
export type RecipeType = InferSchemaType<typeof RecipeSchema> & {
  calculateNutrition(): Promise<NutritionTotals>;
};

const Recipe =
  (models.Recipe as Model<RecipeType>) ||
  model<RecipeType>('Recipe', RecipeSchema);

export default Recipe;
