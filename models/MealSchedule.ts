import mongoose, { Schema } from 'mongoose';
import './Recipe';

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
    timestamps: true,
  }
);

mealScheduleSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Recipe = mongoose.model('Recipe');
    const recipe = await Recipe.findById(this.recipeId);
    if (recipe) {
      this.duration = recipe.prepTime + recipe.cookTime;
    }
  }
  next();
});

export const MealSchedule =
  mongoose.models.MealSchedule ||
  mongoose.model('MealSchedule', mealScheduleSchema);
