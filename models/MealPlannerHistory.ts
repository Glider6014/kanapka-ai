import { Schema, Model, model, models } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

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
    timestamps: true,
  }
);

MealPlannerHistorySchema.set('toJSON', createBaseToJSON());
MealPlannerHistorySchema.set('toObject', createBaseToObject());

export type MealPlannerHistoryType = InferBaseSchemaType<
  typeof MealPlannerHistorySchema
>;

export const MealPlannerHistory =
  (models.MealPlannerHistory as Model<MealPlannerHistoryType>) ||
  model('MealPlannerHistory', MealPlannerHistorySchema);
