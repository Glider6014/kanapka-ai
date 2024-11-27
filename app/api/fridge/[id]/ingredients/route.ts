import { NextRequest, NextResponse } from "next/server";
import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import Fridge, { FridgeType } from "@/models/Fridge";
import { z } from "zod";
import connectDB from "@/lib/connectToDatabase";
import { Session } from "next-auth";
import { generateIngredient } from "@/lib/Ingredients/generateIngredeints";

const ingredientsForm = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().positive(),
      unit: z.enum(["g", "ml", "piece"]),
      expiryDate: z.string().datetime().optional(),
    })
  ),
});

export const GET = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { fridgeId: string } }) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
    const { fridgeId } = params;

    const fridge = await Fridge.findById(fridgeId).populate(
      "ingredients.ingredient"
    );

    if (!fridge) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!(fridge.isOwner(session) || fridge.isMember(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      ingredients: fridge.ingredients,
    });
  }
);

export const POST = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { fridgeId: string } }) => {
    const session = await getServerSessionOrCauseUnathorizedError();
    const { fridgeId } = params;

    const fridge = await Fridge.findById(fridgeId);

    if (!fridge) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!(fridge.isOwner(session) || fridge.isMember(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const result = ingredientsForm.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: result.error.issues },
        { status: 400 }
      );
    }

    const addedIngredients = [];
    const updatedIngredients = [];

    for (const ingredientData of result.data.ingredients) {
      const ingredient = await generateIngredient(ingredientData.name);

      if (!ingredient) continue;

      const updatedIngredient = fridge.ingredients.find(
        (ing) => ing.ingredient.toString() === ingredient._id.toString()
      );

      if (updatedIngredient) {
        updatedIngredient.quantity =
          ingredientData.quantity || updatedIngredient.quantity;

        updatedIngredient.unit = ingredientData.unit || updatedIngredient.unit;

        if (ingredientData.expiryDate) {
          updatedIngredient.expiryDate = new Date(ingredientData.expiryDate);
        }

        updatedIngredients.push(ingredientData.name);
        continue;
      }

      fridge.ingredients.push({
        ingredient: ingredient._id,
        quantity: ingredientData.quantity,
        unit: ingredientData.unit,
        expiryDate: ingredientData.expiryDate
          ? new Date(ingredientData.expiryDate)
          : undefined,
      });

      addedIngredients.push(ingredientData.name);
    }

    await fridge.save();

    return NextResponse.json({
      addedIngredients,
      updatedIngredients,
    });
  }
);

const deleteIngredientsForm = z.object({
  ingredients: z.array(z.string()), // MongoDB ObjectId as string
});

export const DELETE = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { fridgeId: string } }) => {
    const session = await getServerSessionOrCauseUnathorizedError();
    const { fridgeId } = params;

    const fridge = await Fridge.findById(fridgeId);

    if (!fridge) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!(fridge.isOwner(session) || fridge.isMember(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const result = deleteIngredientsForm.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: result.error.issues },
        { status: 400 }
      );
    }

    const deletedIngredients = [];

    for (const ingredientId of result.data.ingredients) {
      const ingredient = fridge.ingredients.find(
        (ing) => ing.ingredient.toString() === ingredientId
      );

      if (!ingredient) continue;

      deletedIngredients.push(ingredientId);

      fridge.ingredients.splice(fridge.ingredients.indexOf(ingredient), 1);
    }

    fridge.save();

    return NextResponse.json({
      deletedIngredients,
    });
  }
);
