import { Schema, InferSchemaType, Model, model, models } from "mongoose";
import { Unit } from "@/types/Unit";

const IngredientSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  name: { type: String, required: true },
  unit: {
    type: String,
    enum: Object.values(Unit),
    required: true,
  },
  nutrition: {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },
    sodium: { type: Number, required: true },
  },
});

// Add index for faster name lookups
IngredientSchema.index({ _id: 1 });
IngredientSchema.index({ name: 1 });

export type IngredientType = InferSchemaType<typeof IngredientSchema>;

const Ingredient =
  (models.Ingredient as Model<IngredientType>) ||
  model("Ingredient", IngredientSchema);

export default Ingredient;
