import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { RecipeType } from "@/models/Recipe";
import InputIngredient from "./InputIngredient";

type SearchRecipesProps = {
  setRecipes: React.Dispatch<React.SetStateAction<RecipeType[]>>;
};

export const SearchRecipes = ({ setRecipes }: SearchRecipesProps) => {
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients, count: 5 }),
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
    setIngredients([""]);
    inputRefs.current = [];
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    if (ingredients.some((ingredient) => ingredient.trim() === "")) {
      return;
    }
    setIngredients([...ingredients, ""]);
    setTimeout(() => {
      inputRefs.current[ingredients.length]?.focus();
    }, 0);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length === 1) {
      setIngredients([""]);
    } else {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="w-full md:w-2/5">
      {ingredients.map((ingredient, index) => (
        <InputIngredient
          key={index}
          value={ingredient}
          onChange={(e) => handleIngredientChange(index, e.target.value)}
          onRemove={() => handleRemoveIngredient(index)}
          onAdd={handleAddIngredient}
          inputRef={(el) => (inputRefs.current[index] = el)}
        />
      ))}
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
