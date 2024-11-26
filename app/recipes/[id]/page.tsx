"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Logo } from "@/components/Logo";

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<any>(null);
  const [nutrition, setNutrition] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipeRes, nutritionRes] = await Promise.all([
          fetch(`/api/recipes/${params.id}`),
          fetch(`/api/recipes/${params.id}/nutrition`),
        ]);

        if (!recipeRes.ok) throw new Error("Failed to fetch recipe");
        const recipeData = await recipeRes.json();
        setRecipe(recipeData);

        if (nutritionRes.ok) {
          const nutritionData = await nutritionRes.json();
          setNutrition(nutritionData);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="text-center pt-10">
          <Logo className="text-5xl md:text-9xl" />
          <p className="mt-4 text-2xl font-bold text-black">Recipe not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-3 pb-5">
      <Navbar />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{recipe.name}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge>{recipe.difficulty}</Badge>
            <Badge variant="secondary">{recipe.experience}XP</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{recipe.description}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Time</h3>
              <div className="flex gap-4">
                <p>Prep: {recipe.prepTime} min</p>
                <p>Cook: {recipe.cookTime} min</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ingredient</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipe.ingredients.map((ing: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{ing.ingredient.name}</TableCell>
                      <TableCell>
                        {ing.amount} {ing.ingredient.unit}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Steps</h3>
              <ol className="list-decimal list-inside space-y-2">
                {recipe.steps.map((step: string, index: number) => (
                  <li key={index} className="text-gray-600">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {nutrition && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Nutrition Facts</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Calories</TableCell>
                      <TableCell>
                        {nutrition.calories.toFixed(1)} kcal
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Protein</TableCell>
                      <TableCell>{nutrition.protein.toFixed(1)} g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Carbs</TableCell>
                      <TableCell>{nutrition.carbs.toFixed(1)} g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fats</TableCell>
                      <TableCell>{nutrition.fats.toFixed(1)} g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fiber</TableCell>
                      <TableCell>{nutrition.fiber.toFixed(1)} g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sugar</TableCell>
                      <TableCell>{nutrition.sugar.toFixed(1)} g</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sodium</TableCell>
                      <TableCell>{nutrition.sodium.toFixed(1)} mg</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
