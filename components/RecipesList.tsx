import { FC } from "react";
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

type RecipesListProps = {
  recipes: RecipeType[];
};

export const RecipesList: FC<RecipesListProps> = ({ recipes }) => {
  if (!recipes.length) {
    return <div>No recipes to display</div>;
  }

  return (
    <div className="mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>RECIPE NAME</TableHead>
            <TableHead>DIFFICULTY</TableHead>
            <TableHead>TOTAL PREPARATION TIME</TableHead>
            <TableHead>DETAILS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recipes.map((recipe) => (
            <TableRow key={recipe._id?.toString()}>
              <TableCell>{recipe.name}</TableCell>
              <TableCell>{recipe.difficulty}</TableCell>
              <TableCell>{recipe.prepTime + recipe.cookTime} min</TableCell>
              <TableCell>
                <Link href={`/recipes/${recipe._id}`} target="_blank">
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
