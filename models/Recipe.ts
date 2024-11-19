import { Schema, model, models } from "mongoose";

const RecipeSchema = new Schema({
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

const Recipe = models.Recipe || model("Recipe", RecipeSchema);
export default Recipe;
