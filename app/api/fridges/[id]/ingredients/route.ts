import { NextRequest, NextResponse } from "next/server";
import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import { z } from "zod";
import connectDB from "@/lib/connectToDatabase";
import { generateIngredient } from "@/lib/ingredients/generateIngredients";

const ingredientsForm = z.object({
  ingredients: z.array(z.string().trim()),
});

export const GET = withApiErrorHandling(
  async (req: NextRequest, { params }: { params: { fridgeId: string } }) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
    const { fridgeId } = params;

    const fridge = await Fridge.findById(fridgeId);

    if (!fridge) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!(fridge.isOwner(session) || fridge.isMember(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ ingredients: fridge.ingredients });
  }
);

export const PATCH = withApiErrorHandling(
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

    const ingredients = [];

    for (const ingredientInput of result.data.ingredients) {
      if (ingredientInput.length === 0) continue;

      const ingredient = await generateIngredient(ingredientInput);
      if (!ingredient) continue;

      ingredients.push(ingredient.name);
    }

    fridge.ingredients = ingredients;
    await fridge.save();

    return NextResponse.json({ ingredients });
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

    const ingredients = [];

    for (const ingredient in fridge.ingredients) {
      if (result.data.ingredients.includes(ingredient)) continue;

      ingredients.push(ingredient);
    }

    fridge.ingredients = ingredients;
    await fridge.save();

    return NextResponse.json({ ingredients });
  }
);
