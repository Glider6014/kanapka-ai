"use client";

import { RecipesList } from "@/components/RecipesList";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";
import { FridgesPanel } from "@/components/FridgesPanel";
import { Navbar } from "./Navbar";

export function DashboardPage() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchRecipes = (ingredients: string[]) => {
    setIsSearching(true);

    fetch("/api/recipes/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients, count: 5 }),
    })
      .then(async (res) => {
        if (!res.ok) {
          alert(`Failed to search recipes: ${(await res.json()).error}`);
          throw new Error("Failed to search recipes");
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setRecipes(data.recipes);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  return (
    <div className="container mx-auto overflow-hidden">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-4">
        <FridgesPanel
          searchRecipes={handleSearchRecipes}
          isSearchRecipesButtonVisible={true}
          isSearchRecipesButtonDisabled={isSearching}
        />
        <div className="w-full md:w-3/5 mt-4 md:mt-0">
          <RecipesList recipes={recipes} />
        </div>
      </div>
    </div>
  );
}
