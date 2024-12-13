import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const RecipeGeneratorHistorySchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export type RecipeGeneratorHistoryType = InferSchemaType<
  typeof RecipeGeneratorHistorySchema
>;

export const RecipeGeneratorHistory =
  (models.RecipeGeneratorHistory as Model<RecipeGeneratorHistoryType>) ||
  model("RecipeGeneratorHistory", RecipeGeneratorHistorySchema);
