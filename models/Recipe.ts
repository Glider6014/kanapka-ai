import { Schema, InferSchemaType, Model, model, models } from "mongoose";
import "./Ingredient"; // Required for population

const RecipeSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: [
    {
      ingredient: {
        type: Schema.Types.ObjectId,
        ref: "Ingredient",
        required: true,
      },
      amount: { type: Number, required: true },
    },
  ],
  steps: [{ type: String, required: true }],
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
    default: "Easy",
  },
  experience: { type: Number, required: true, default: 10 },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
});

export type RecipeType = InferSchemaType<typeof RecipeSchema>;

const Recipe =
  (models.Recipe as Model<RecipeType>) || model("Recipe", RecipeSchema);

export default Recipe;
