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
  async (req: NextRequest, { params }: { params: { id: string } }) => {
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
  async (req: NextRequest, { params }: { params: { id: string } }) => {
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
    const result = ingredientsForm.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", issues: result.error.issues },
        { status: 400 }
      );
    }

    const ingredientNames = (
      await Promise.all(
        result.data.ingredients
          .filter((ing) => ing.length > 0)
          .map(async (ing) => {
            const ingredient = await generateIngredient(ing);
            return ingredient ? ingredient.name : null;
          })
      )
    ).filter((ing) => ing !== null);

    fridge.ingredients = ingredientNames;
    await fridge.save();

    return NextResponse.json({ ingredients: ingredientNames });
  }
);
