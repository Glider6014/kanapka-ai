import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const IngredientSchema = new Schema({
  name: { type: String, required: true },
  unit: {
    type: String,
    enum: ["g", "ml", "piece"],
    required: true,
  },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number },
    sugar: { type: Number },
    sodium: { type: Number },
  },
});

type IngredientType = InferSchemaType<typeof IngredientSchema>;

export type { IngredientType };

const Ingredient =
  (models.Ingredient as Model<IngredientType>) ||
  model("Ingredient", IngredientSchema);

export default Ingredient;
