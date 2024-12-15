import mongoose, {
  Document,
  InferSchemaType,
  model,
  Model,
  models,
  Schema,
} from 'mongoose';
import './Recipe';
import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { IngredientType } from './Ingredient';
import { RecipeType, RecipeTypeWithPopulatedIngredients } from './Recipe';

const mealScheduleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Recipe',
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
    },
  },
  {
    ...schemaOptionsSwitchToId,
    timestamps: true,
  }
);

mealScheduleSchema.pre(
  'save',
  async function (this: Document & MealScheduleType, next) {
    if (this.isNew) {
      const Recipe = mongoose.model('Recipe');
      const recipe = await Recipe.findById(this.recipeId);
      if (recipe) {
        this.duration = recipe.prepTime + recipe.cookTime;
      }
    }
    next();
  }
);

export type MealScheduleType = InferSchemaType<typeof mealScheduleSchema> &
  withId;

export const MealSchedule =
  (models.MealSchedule as Model<MealScheduleType>) ||
  model('MealSchedule', mealScheduleSchema);

// <-- Additional populated types -->

export type MealScheduleTypeWithPopulatedRecipe = Omit<
  MealScheduleType,
  'recipeId'
> & {
  recipeId: RecipeType;
};

export type MealScheduleTypeWithPopulatedRecipeWithPopulatedIngredients = Omit<
  MealScheduleType,
  'recipeId'
> & {
  recipeId: RecipeTypeWithPopulatedIngredients;
};
