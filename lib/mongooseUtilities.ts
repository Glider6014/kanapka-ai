type withOptional_id = { _id?: string };

export const schemaOptionsSwitchToId = {
  id: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: unknown, ret: withOptional_id) => {
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_doc: unknown, ret: withOptional_id) => {
      delete ret._id;
    },
  },
};

export type withId = { id: string };
