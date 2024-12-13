import { Schema, InferSchemaType, Model, model, models } from 'mongoose';

const MealPlannerHistorySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    preferences: {
      type: String,
      required: true,
    },
    // mealSchedules: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "MealSchedule",
    //     required: true,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

export type MealPlannerHistoryType = InferSchemaType<
  typeof MealPlannerHistorySchema
>;

export const MealPlannerHistory =
  (models.MealPlannerHistory as Model<MealPlannerHistoryType>) ||
  model('MealPlannerHistory', MealPlannerHistorySchema);
