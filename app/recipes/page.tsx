import { RecipesList } from "@/components/RecipesList";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";
import { Navbar } from "@/components/Navbar";

const RecipesPage = async () => {
  await connectDB();
  const recipes = await Recipe.find({})
    .populate("ingredients.ingredient")
    .lean();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gray-300 p-5 text-gray-700">
        Recipes List
      </h2>
      <RecipesList recipes={JSON.parse(JSON.stringify(recipes))} />
    </div>
  );
};

export default RecipesPage;
