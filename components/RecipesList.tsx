import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const RecipesList = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data.recipes);
        } else {
          console.error("Błąd podczas pobierania przepisów");
        }
      } catch (error) {
        console.error("Błąd:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (isLoading) {
    return <div>Ładowanie przepisów...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Lista przepisów</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAZWA RECEPTURY</TableHead>
            <TableHead>TRUDNOŚĆ POTRAWY</TableHead>
            <TableHead>ŁĄCZNY CZAS PRZYGOTOWANIA</TableHead>
            <TableHead>SZCZEGÓŁY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe._id}>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>{recipe.difficulty}</TableCell>
              <TableCell>{recipe.prepTime + recipe.cookTime} min</TableCell>
              <TableCell>
                <Link href={`/recipes/${recipe._id}`}>
                  <Button variant="link">Zobacz</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
