import { Schema, InferSchemaType, Model, model, models } from "mongoose";

// Add system user constant
export const SYSTEM_USER_ID = "SYSTEM";

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
    type: Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (v: any) {
        return typeof v === "string" || v instanceof Schema.Types.ObjectId;
      },
      message: "Created by must be either string or ObjectId",
    },
  },
  createdAt: { type: Date, default: Date.now, required: true },
});

type RecipeType = InferSchemaType<typeof RecipeSchema>;

export type { RecipeType };

const Recipe =
  (models.Recipe as Model<RecipeType>) || model("Recipe", RecipeSchema);

export default Recipe;
