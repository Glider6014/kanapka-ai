import { NextRequest, NextResponse } from "next/server";
import { processApiHandler } from "@/lib/apiUtils";
import { paginationGetRecipes, GetRecipesSchema } from "./logic";

const MAX_RECIPES = 100;

const handleGET = async (req: NextRequest) => {
  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries());

  const params = GetRecipesSchema.parse(searchParams);
  params.limit = Math.min(params.limit, MAX_RECIPES);

  const recipesData = await paginationGetRecipes(params);

  return NextResponse.json(recipesData);
};

export const GET = processApiHandler(handleGET);
