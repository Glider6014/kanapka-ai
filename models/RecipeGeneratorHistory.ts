import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { Schema, InferSchemaType, Model, model, models } from 'mongoose';

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
    ...schemaOptionsSwitchToId,
    timestamps: true,
  }
);

export type RecipeGeneratorHistoryType = InferSchemaType<
  typeof RecipeGeneratorHistorySchema
> &
  withId;

export const RecipeGeneratorHistory =
  (models.RecipeGeneratorHistory as Model<RecipeGeneratorHistoryType>) ||
  model('RecipeGeneratorHistory', RecipeGeneratorHistorySchema);
