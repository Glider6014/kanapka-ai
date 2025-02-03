import { Schema, Model, model, models } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

const UserSubSchema = {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
};

const FridgeSchema = new Schema({
  name: { type: String, required: true },
  owner: UserSubSchema,
  members: [UserSubSchema],
  ingredients: {
    type: [String],
    default: [],
    required: true,
  },
});

FridgeSchema.set('toJSON', createBaseToJSON());
FridgeSchema.set('toObject', createBaseToObject());

FridgeSchema.methods.isOwner = function (this: FridgeType, userId: string) {
  return this.owner.toString() === userId;
};

FridgeSchema.methods.isMember = function (this: FridgeType, userId: string) {
  return this.members.some((member) => member.toString() === userId);
};

export type FridgeType = InferBaseSchemaType<typeof FridgeSchema> & {
  isOwner: (_userId: string) => boolean;
  isMember: (_userId: string) => boolean;
};

export const Fridge =
  (models.Fridge as Model<FridgeType>) || model('Fridge', FridgeSchema);
