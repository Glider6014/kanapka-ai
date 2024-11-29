"use client";

import { RecipesList } from "@/components/RecipesList";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";
import { FridgesPanel } from "@/components/FridgesPanel";

export function DashboardPage() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <FridgesPanel setRecipes={setRecipes} />
          <div className="w-full md:w-3/5 mt-4 md:mt-0">
            <RecipesList recipes={recipes} />
          </div>
        </div>
      </div>
    </>
  );
}
