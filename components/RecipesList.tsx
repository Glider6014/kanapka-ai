"use client";

import { FC, useState } from "react";
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
import { RecipeType } from "@/models/Recipe";
import { HeartOff } from "lucide-react";
import { Heart } from "lucide-react";

type RecipesListProps = {
  recipes: RecipeType[];
};

export const RecipesList: FC<RecipesListProps> = ({ recipes }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(id)
        ? prevFavorites.filter((favId) => favId !== id)
        : [...prevFavorites, id]
    );
  };

  if (!recipes.length) {
    return <div>No recipes to display</div>;
  }

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">FAVORITE</TableHead>
            <TableHead>RECIPE NAME</TableHead>
            <TableHead>DIFFICULTY</TableHead>
            <TableHead>TOTAL PREPARATION TIME</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe._id?.toString()}>
              <TableCell className="w-16">
                <button
                  className="flex justify-center items-center w-full h-full"
                  onClick={() => toggleFavorite(recipe._id?.toString()!)}
                >
                  {favorites.includes(recipe._id?.toString()!) ? (
                    <Heart />
                  ) : (
                    <HeartOff />
                  )}
                </button>
              </TableCell>
              <TableCell>
                <Link href={`/recipes/${recipe._id}`} target="_blank">
                  <Button variant="link">{recipe.name}</Button>
                </Link>
              </TableCell>
              <TableCell>{recipe.difficulty}</TableCell>
              <TableCell>{recipe.prepTime + recipe.cookTime} min</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
