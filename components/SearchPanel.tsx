import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";
import { IngredientInput } from "@/app/api/ingredients/types";
import InputIngredinet from "./InputIngredient";

type SearchRecipesProps = {
  setRecipes: React.Dispatch<React.SetStateAction<RecipeType[]>>;
};

export const SearchRecipes = ({ setRecipes }: SearchRecipesProps) => {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.split(","), count: 5 }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes);
        router.refresh();
      } else {
        console.error("Błąd podczas generowania przepisów");
      }
    } catch (error) {
      console.error("Błąd:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setIngredients("");
  };

  return (
    <div className="w-full md:w-2/5">
      <InputIngredinet />
      <Textarea
        className="min-h-[150px] md:min-h-[400px] w-full"
        placeholder="Enter your ingredients here..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="w-full md:w-1/2"
        >
          Clear
        </Button>
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full md:w-1/2"
        >
          {isLoading ? "Searching..." : "Search"}
        </Button>
      </div>
    </div>
  );
};

export default SearchRecipes;
