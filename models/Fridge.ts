import { schemaOptionsWithId, withId } from '@/lib/mongooseUtilities';
import { Schema, InferSchemaType, Model, model, models } from 'mongoose';

const UserSubSchema = {
  type: Schema.Types.ObjectId,
  ref: 'User',
  required: true,
};

const FridgeSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: UserSubSchema,
    members: [UserSubSchema],
    ingredients: {
      type: [String],
      default: [],
      required: true,
    },
  },
  {
    ...schemaOptionsWithId,
  }
);

FridgeSchema.methods.isOwner = function (this: FridgeType, userId: string) {
  return this.owner.toString() === userId;
};

FridgeSchema.methods.isMember = function (this: FridgeType, userId: string) {
  return this.members.some((member) => member._id.toString() === userId);
};

FridgeSchema.methods.canAccess = function (this: FridgeType, userId: string) {
  return this.isOwner(userId) || this.isMember(userId);
};

export type FridgeType = InferSchemaType<typeof FridgeSchema> &
  withId & {
    isOwner: (_userId: string) => boolean;
    isMember: (_userId: string) => boolean;
    canAccess: (_userId: string) => boolean;
  };

const Fridge =
  (models.Fridge as Model<FridgeType>) || model('Fridge', FridgeSchema);

export default Fridge;
