import { Schema, InferSchemaType, Model, model, models } from 'mongoose';
import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { unitsList } from '@/lib/units';

const nutritionSchema = new Schema({
  calories: { type: Number, required: true, default: 0 },
  protein: { type: Number, required: true, default: 0 },
  fats: { type: Number, required: true, default: 0 },
  carbs: { type: Number, required: true, default: 0 },
  fiber: { type: Number, required: true, default: 0 },
  sugar: { type: Number, required: true, default: 0 },
  sodium: { type: Number, required: true, default: 0 },
});

const IngredientSchema = new Schema(
  {
    name: { type: String, required: true },
    unit: {
      type: String,
      enum: unitsList,
      required: true,
    },
    nutrition: {
      type: nutritionSchema,
      required: true,
    },
  },
  {
    ...schemaOptionsSwitchToId,
  }
);

// Add index for faster name lookups
IngredientSchema.index({ name: 1 });

export type IngredientType = InferSchemaType<typeof IngredientSchema> & withId;

const Ingredient =
  (models.Ingredient as Model<IngredientType>) ||
  model('Ingredient', IngredientSchema);

export default Ingredient;
