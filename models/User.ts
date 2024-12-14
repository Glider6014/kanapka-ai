import { schemaOptionsSwitchToId, withId } from '@/lib/mongooseUtilities';
import { UserPermissions, userPermissionsList } from '@/lib/permissions';
import { userSubscriptionsList, UserSubscription } from '@/lib/subscriptions';
import { Schema, InferSchemaType, Model, model, models } from 'mongoose';

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
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
    ...schemaOptionsSwitchToId,
    timestamps: true,
  }
);

// Double index for faster lookups
UserSchema.index({ username: 1 });

export type UserType = InferSchemaType<typeof UserSchema> & withId;

const User = (models.User as Model<UserType>) || model('User', UserSchema);

export default User;
