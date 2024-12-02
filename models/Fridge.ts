import { Schema, InferSchemaType, Model, model, models } from "mongoose";
import { UserType } from "./User";
import { Session } from "next-auth";

const UserSubSchema = {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
};

const FridgeSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  name: { type: String, required: true },
  owner: UserSubSchema,
  members: [UserSubSchema],
  ingredients: {
    type: [String],
    default: [],
    required: true,
  },
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
  (models.Fridge as Model<FridgeType>) || model("Fridge", FridgeSchema);

export default Fridge;