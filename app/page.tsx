"use client";
import Image from "next/image";
import { SearchRecipes } from "@/components/SearchRecipes";
import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [count, setCount] = useState(1);
  const [recipes, setRecipes] = useState<{ _id: string; name: string }[]>([]);

  const handleGenerate = async () => {
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.split(","), count }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
      } else {
        console.error("Błąd podczas generowania przepisów");
      }
    } catch (error) {
      console.error("Błąd:", error);
    }
  };

  return (
    <>
      <SearchRecipes />
      <div>
        <input
          type="text"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Wprowadź składniki, oddzielone przecinkami"
        />
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
          placeholder="Liczba przepisów"
        />
        <button onClick={handleGenerate}>Generuj przepisy</button>
      </div>
      <div>
        {recipes.map((recipe) => (
          <div key={recipe._id}>
            <h2>{recipe.name}</h2>
          </div>
        ))}
      </div>
    </>
  );
}
