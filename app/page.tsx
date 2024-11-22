"use client";
import { Navbar } from "@/components/Navbar";
import SearchPanel from "@/components/SearchPanel";
import { RecipesList } from "@/components/RecipesList";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";

export default function Home() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);
  return (
    <>
      <div className="container mx-auto p-4">
        <Navbar />
        <div className="flex flex-col md:flex-row gap-4">
          <SearchPanel setRecipes={setRecipes} />
          <div className="w-full md:w-3/5 mt-4 md:mt-0">
            <RecipesList recipes={recipes} />
          </div>
        </div>
      </div>
    </>
  );
}
