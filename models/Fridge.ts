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

function extractUserId(sessionOrUserOrId: string | UserType | Session) {
  return typeof sessionOrUserOrId === "string"
    ? sessionOrUserOrId
    : (sessionOrUserOrId as Session)?.user?.id ||
        (sessionOrUserOrId as UserType)?._id;
}

FridgeSchema.methods.isOwner = function (
  this: FridgeType,
  sessionOrUserOrId: string | UserType | Session
) {
  const userId = extractUserId(sessionOrUserOrId);

  return this.owner.toString() === userId;
};

FridgeSchema.methods.isMember = function (
  this: FridgeType,
  sessionOrUserOrId: string | UserType | Session
) {
  const userId = extractUserId(sessionOrUserOrId);

  return this.members.some((member) => member._id.toString() === userId);
};

export type FridgeType = InferSchemaType<typeof FridgeSchema> & {
  isOwner: (sessionOrUserOrId: string | UserType | Session) => boolean;
  isMember: (sessionOrUserOrId: string | UserType | Session) => boolean;
};

const Fridge =
  (models.Fridge as Model<FridgeType>) || model("Fridge", FridgeSchema);

export default Fridge;
