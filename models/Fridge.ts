// 'quantity' and 'unit' are prepared for next version, not implemented yet

import { Schema, InferSchemaType, Model, model, models } from "mongoose";
import { UserType } from "./User";
import { Session } from "next-auth";

const UserSubSchema = {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
};

const IngredientSubSchema = {
  type: Schema.Types.ObjectId,
  ref: "Ingredient",
  required: true,
};

// const UnitSubSchema = {
//   type: String,
//   enum: ["g", "ml", "piece"],
//   required: true,
// };

const FridgeSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  name: { type: String, required: true },
  owner: UserSubSchema,
  members: [UserSubSchema],
  ingredients: [
    {
      ingredient: IngredientSubSchema,
      // quantity: Number,
      // unit: UnitSubSchema,
      expiryDate: Date,
    },
  ],
});

FridgeSchema.methods.isOwner = function (
  sessionOrUserOrId: string | UserType | Session
) {
  if (typeof sessionOrUserOrId === "string") {
    return this.owner.toString() === sessionOrUserOrId;
  }

  const userId =
    (sessionOrUserOrId as Session)?.user?.id ||
    (sessionOrUserOrId as UserType)?._id;

  return this.owner.toString() === userId;
};

FridgeSchema.methods.isMember = function (
  sessionOrUserOrId: string | UserType | Session
) {
  if (typeof sessionOrUserOrId === "string") {
    return this.members.some(
      (member: UserType) => member._id.toString() === sessionOrUserOrId
    );
  }

  const userId =
    (sessionOrUserOrId as Session)?.user?.id ||
    (sessionOrUserOrId as UserType)?._id;

  return this.members.some(
    (member: UserType) => member._id.toString() === userId
  );
};

export type FridgeType = InferSchemaType<typeof FridgeSchema> & {
  isOwner: (sessionOrUserOrId: string | UserType | Session) => boolean;
  isMember: (sessionOrUserOrId: string | UserType | Session) => boolean;
};

const Fridge =
  (models.Ingredient as Model<FridgeType>) || model("Fridge", FridgeSchema);

export default Fridge;
