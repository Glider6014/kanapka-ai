import { Document, model, Model, models, Schema } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';
import {
  Recipe,
  RecipeType,
  RecipeTypeWithPopulatedIngredients,
} from './Recipe';

const MealScheduleSchema = new Schema(
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
    timestamps: true,
  }
);

MealScheduleSchema.set('toJSON', createBaseToJSON());
MealScheduleSchema.set('toObject', createBaseToObject());

MealScheduleSchema.pre(
  'save',
  async function (this: Document & MealScheduleType, next) {
    if (this.isNew) {
      const recipe = await Recipe.findById(this.recipeId);
      if (recipe) {
        this.duration = recipe.prepTime + recipe.cookTime;
      }
    }
    next();
  }
);

export type MealScheduleType = InferBaseSchemaType<typeof MealScheduleSchema>;

export const MealSchedule =
  (models.MealSchedule as Model<MealScheduleType>) ||
  model('MealSchedule', MealScheduleSchema);

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
