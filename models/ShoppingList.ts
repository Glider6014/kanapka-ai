import { Schema, InferSchemaType, Model, model, models } from "mongoose";

const ShoppingListSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    items: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        checked: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export type ShoppingListType = InferSchemaType<typeof ShoppingListSchema>;

const ShoppingList =
  (models.ShoppingList as Model<ShoppingListType>) ||
  model("ShoppingList", ShoppingListSchema);

export default ShoppingList;
