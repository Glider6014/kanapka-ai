import { NextRequest, NextResponse } from "next/server";
import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import { z } from "zod";
import connectDB from "@/lib/connectToDatabase";
import { generateIngredient } from "@/lib/ingredients/generateIngredients";
import { validateIngredients } from "@/lib/ingredients/validateNames";

type Context = { params: { id: string } };

const ingredientsForm = z.object({
  ingredients: z.array(z.string().trim()),
});

export const GET = withApiErrorHandling(
  async (req: NextRequest, { params }: Context) => {
    await connectDB();

    const session = await getServerSessionOrCauseUnathorizedError();
    const { id: fridgeId } = params;

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

export const PUT = withApiErrorHandling(
  async (req: NextRequest, { params }: Context) => {
    const session = await getServerSessionOrCauseUnathorizedError();
    const { id: fridgeId } = params;

    const fridge = await Fridge.findById(fridgeId);

    if (!fridge) {
      return NextResponse.json({ error: "Fridge not found" }, { status: 404 });
    }

    if (!(fridge.isOwner(session) || fridge.isMember(session))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const validationResult = ingredientsForm.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: validationResult.error.issues },
        { status: 400 }
      );
    }

    // Validate ingredients first
    const validationResults = await validateIngredients(
      validationResult.data.ingredients.filter((ing) => ing.length > 0)
    );

    const invalidIngredients = validationResults.filter((r) => !r.isValid);
    if (invalidIngredients.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid ingredients detected",
          invalidIngredients: invalidIngredients.map((r) => r.ingredient),
        },
        { status: 400 }
      );
    }

    const ingredientNames = (
      await Promise.all(
        validationResults.map(async (validation) => {
          const ingredient = await generateIngredient(validation.ingredient);
          return ingredient ? ingredient.name : null;
        })
      )
    ).filter((ing) => ing !== null);

    fridge.ingredients = ingredientNames;
    await fridge.save();

    return NextResponse.json({ ingredients: ingredientNames });
  }
);
