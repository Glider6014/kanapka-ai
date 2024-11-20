import { RecipesList } from "@/components/RecipesList";
import connectDB from "@/lib/connectToDatabase";
import Recipe, { RecipeType } from "@/models/Recipe";

type RecipesPageProps = {
  recipes: RecipeType[];
};

const RecipesPage = async () => {
  await connectDB();
  const recipes = await Recipe.find({})
    .populate("ingredients.ingredient")
    .lean();

  return (
    <div>
      <RecipesList recipes={JSON.parse(JSON.stringify(recipes))} />
    </div>
  );
};

export default RecipesPage;
