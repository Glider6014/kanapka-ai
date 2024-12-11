"use client";

import { RecipesList } from "@/components/RecipesList";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";
import { FridgesPanel } from "@/components/FridgesPanel";
import { Navbar } from "./Navbar";

export function DashboardPage() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchRecipes = async (ingredients: string[]) => {
    setIsSearching(true);
    setRecipes([]);

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, count: 5 }),
      });

      if (!response.ok || !response.body) {
        const error = await response.json();
        alert(`Failed to search recipes: ${error.error}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const messages = buffer.split("\n\n");
        buffer = messages.pop() || "";

        for (const message of messages) {
          if (message.startsWith("data: ")) {
            const json = message.replace("data: ", "").trim();
            try {
              const recipeData = JSON.parse(json) as RecipeType;
              setRecipes((prev) => {
                if (prev.some((r) => r._id === recipeData._id)) return prev;
                return [...prev, recipeData];
              });
            } catch (error) {
              console.error("Error parsing recipe:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setIsSearching(false);
    }
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
          {recipes.length > 0 ? (
            <RecipesList recipes={recipes} />
          ) : (
            <div className="text-center text-gray-500">
              {isSearching ? "Generating recipes..." : "No recipes to display"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
