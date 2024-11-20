"use client";
import { useState } from "react";
import { SearchRecipes } from "@/components/SearchRecipes";
import { RecipesList } from "@/components/RecipesList";
import { RecipeType } from "@/models/Recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  return (
    <>
      <SearchRecipes setRecipes={setRecipes} />
      <RecipesList recipes={recipes} />
    </>
  );
}
