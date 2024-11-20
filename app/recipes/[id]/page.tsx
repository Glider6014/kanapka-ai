"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecipePage({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const data = await res.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
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
        <p>Recipe not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
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
                      <TableCell>{ing.amount}</TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
