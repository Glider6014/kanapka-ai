"use client";

import { FC, useState, useEffect } from "react";
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
import { useSession } from "next-auth/react";

type RecipesListProps = {
  recipes: RecipeType[];
};

export const RecipesList: FC<RecipesListProps> = ({ recipes }) => {
  const { status } = useSession();

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch("/api/recipes/favorite");
        const data = await response.json();
        if (response.ok) {
          setFavorites(data.favorites.map((fav: { _id: string }) => fav._id));
        }
      } catch (error) {
        console.error("Failed to fetch favorites", error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    try {
      const isFavorite = favorites.includes(id);
      const response = await fetch(`/api/recipes/${id}/favorite`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      if (response.ok) {
        setFavorites((prevFavorites) =>
          isFavorite
            ? prevFavorites.filter((favId) => favId !== id)
            : [...prevFavorites, id]
        );
      } else {
        console.error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  if (!recipes.length) {
    return <div>No recipes to display</div>;
  }

  return (
    <div className="mt-8 transform -translate-y-[30px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100 hover:bg-gray-100">
            <TableHead className="w-16">FAVORITE</TableHead>
            <TableHead>RECIPE NAME</TableHead>
            <TableHead>DIFFICULTY</TableHead>
            <TableHead className="md:max-w-16">
              TOTAL PREPARATION TIME
            </TableHead>
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
