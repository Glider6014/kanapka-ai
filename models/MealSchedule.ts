import mongoose, { Schema } from "mongoose";
import "./Recipe";
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
      ref: "Recipe",
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MealSchedule =
  mongoose.models.MealSchedule ||
  mongoose.model("MealSchedule", mealScheduleSchema);
