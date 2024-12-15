import { unitsList } from '@/lib/units';
import { Schema, Model, model, models } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

const nutritionSchema = new Schema({
  calories: { type: Number, required: true, default: 0 },
  protein: { type: Number, required: true, default: 0 },
  fats: { type: Number, required: true, default: 0 },
  carbs: { type: Number, required: true, default: 0 },
  fiber: { type: Number, required: true, default: 0 },
  sugar: { type: Number, required: true, default: 0 },
  sodium: { type: Number, required: true, default: 0 },
});

const IngredientSchema = new Schema({
  name: { type: String, required: true, index: true, unique: true },
  unit: {
    type: String,
    enum: unitsList,
    required: true,
  },
  nutrition: {
    type: nutritionSchema,
    required: true,
  },
});

IngredientSchema.set('toJSON', createBaseToJSON());
IngredientSchema.set('toObject', createBaseToObject());

export type IngredientType = InferBaseSchemaType<typeof IngredientSchema>;

export const Ingredient =
  (models.Ingredient as Model<IngredientType>) ||
  model('Ingredient', IngredientSchema);
