import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  permissions: {
    type: [String],
    required: true,
    default: ["read:recipes"],
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", required: true }],
  experience: { type: Number, default: 0, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

type UserType = InferSchemaType<typeof UserSchema>;

export type { UserType };

const User = (models.User as Model<UserType>) || model("User", UserSchema);

export default User;
