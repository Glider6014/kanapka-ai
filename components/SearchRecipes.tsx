import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RecipeType } from "@/models/Recipe";

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
    <div className="container mx-auto p-4">
      <nav className="mb-8 flex items-center justify-between">
        <div className="text-xl font-bold">Kanapka AI</div>
        <div className="flex gap-4">
          <Button variant="default">WYSZUKAJ RECEPTURY</Button>
          <Button variant="outline">LOGOWANIE</Button>
          <Button variant="outline">REJESTRACJA</Button>
        </div>
      </nav>
      <div className="flex gap-4">
        <div className="w-2/5">
          <Textarea
            className="min-h-[400px]"
            placeholder="Wpisz składniki..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <div className="mt-4 flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              Wyczyść
            </Button>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Szukam..." : "Szukaj"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
