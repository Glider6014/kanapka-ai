import { UserPermissions, userPermissionsList } from "@/lib/permissions";
import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const UserSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, auto: true, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: {
    type: [String],
    enum: userPermissionsList,
    required: true,
    default: [UserPermissions.readRecipes],
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", required: true }],
  createdAt: { type: Date, default: Date.now, required: true },
});

// Double index for faster lookups
UserSchema.index({ _id: 1 });
UserSchema.index({ username: 1 });

export type UserType = InferSchemaType<typeof UserSchema>;

const User = (models.User as Model<UserType>) || model("User", UserSchema);

export default User;
