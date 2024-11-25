import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const IngredientSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
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
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },
    sodium: { type: Number, required: true },
  },
});

export type IngredientType = InferSchemaType<typeof IngredientSchema>;

const Ingredient =
  (models.Ingredient as Model<IngredientType>) ||
  model("Ingredient", IngredientSchema);

export default Ingredient;
