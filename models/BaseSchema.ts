import { InferSchemaType } from 'mongoose';

export const createBaseToJSON = () => ({
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: unknown & { _id?: string }) => {
    delete ret._id;
    return ret;
  },
});

export const createBaseToObject = () => ({
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: unknown & { _id?: string }) => {
    delete ret._id;
    return ret;
  },
});

export type InferBaseSchemaType<T> = InferSchemaType<T> & {
  id: string;
};
