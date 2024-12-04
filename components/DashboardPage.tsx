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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients, count: 5 }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Failed to search recipes: ${error.error}`);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const processStream = async () => {
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          buffer += new TextDecoder().decode(value);
          const lines = buffer.split("\n");

          // Process all complete lines
          for (let i = 0; i < lines.length - 1; i++) {
            if (!lines[i].trim()) continue;

            try {
              const { recipe, error } = JSON.parse(lines[i]);
              if (error) {
                console.error("Stream error:", error);
                continue;
              }
              if (recipe) {
                setRecipes((prev) => [...prev, recipe]);
              }
            } catch (e) {
              console.error("Parse error:", e);
            }
          }

          // Keep the last incomplete line in the buffer
          buffer = lines[lines.length - 1];
        }
      };

      await processStream();
    } catch (err) {
      console.error("Stream error:", err);
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
          <RecipesList recipes={recipes} />
        </div>
      </div>
    </div>
  );
}
