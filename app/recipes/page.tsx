import { RecipesList } from "@/components/RecipesList";
import connectDB from "@/lib/connectToDatabase";
import Recipe, { RecipeType } from "@/models/Recipe";
import { Navbar } from "@/components/Navbar";

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
      <Navbar />
      <h2 className="text-2xl font-bold mb-4">Recipes List</h2>
      <RecipesList recipes={JSON.parse(JSON.stringify(recipes))} />
    </div>
  );
};

export default RecipesPage;
