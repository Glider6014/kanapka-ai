import { Schema, Model, model, models } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

const RecipeGeneratorHistorySchema = new Schema(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ingredients: [
      {
        type: String,
        required: true,
      },
    ],
    // generatedRecipes: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "Recipe",
    //     required: true,
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

RecipeGeneratorHistorySchema.set('toJSON', createBaseToJSON());
RecipeGeneratorHistorySchema.set('toObject', createBaseToObject());

export type RecipeGeneratorHistoryType = InferBaseSchemaType<
  typeof RecipeGeneratorHistorySchema
>;

export const RecipeGeneratorHistory =
  (models.RecipeGeneratorHistory as Model<RecipeGeneratorHistoryType>) ||
  model('RecipeGeneratorHistory', RecipeGeneratorHistorySchema);
