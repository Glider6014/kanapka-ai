import { Schema, model, models } from "mongoose";

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

const User = models.User || model("User", UserSchema);
export default User;
