import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { Schema, InferSchemaType, Model, model, models } from 'mongoose';

const MealPlannerHistorySchema = new Schema(
  {
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
    ...schemaOptionsSwitchToId,
    timestamps: true,
  }
);

export type MealPlannerHistoryType = InferSchemaType<
  typeof MealPlannerHistorySchema
> &
  withId;

export const MealPlannerHistory =
  (models.MealPlannerHistory as Model<MealPlannerHistoryType>) ||
  model('MealPlannerHistory', MealPlannerHistorySchema);
