import { UserPermissions, userPermissionsList } from '@/lib/permissions';
import { userSubscriptionsList, UserSubscription } from '@/lib/subscriptions';
import { Schema, Model, model, models } from 'mongoose';
import {
  createBaseToJSON,
  createBaseToObject,
  InferBaseSchemaType,
} from './BaseSchema';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    permissions: {
      type: [String],
      enum: userPermissionsList,
      required: true,
      default: [UserPermissions.readRecipes],
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Recipe', required: true }],
    bio: { type: String, default: '' },
    avatar: { type: String, default: 'https://github.com/shadcn.png' },
    bgc: { type: String, default: '' },
    subscriptionType: {
      type: String,
      enum: userSubscriptionsList,
      required: true,
      default: UserSubscription.FREE,
    },
    stripeCheckoutSessionId: { type: String },
    // following: { type: Number, default: 0 },
    // followers: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.set('toJSON', createBaseToJSON());
UserSchema.set('toObject', createBaseToObject());

export type UserType = InferBaseSchemaType<typeof UserSchema>;

export const User =
  (models.User as Model<UserType>) || model('User', UserSchema);
