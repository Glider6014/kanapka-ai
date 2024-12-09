import { Navbar } from "@/components/Navbar";
import { RecipesList } from "@/components/RecipesList";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

const RecipesPage = async () => {
  await connectDB();
  const recipes = await Recipe.find({})
    .populate("ingredients.ingredient")
    .lean();

  const userId = "currentUserId"; // Replace with actual user ID fetching logic

  return (
    <div className="container mx-auto overflow-hidden">
      <Navbar />
      <h2 className="text-2xl font-bold mb-4 text-center bg-gray-300 p-5 text-gray-700">
        Recipes List
      </h2>
      <RecipesList recipes={JSON.parse(JSON.stringify(recipes))} userId={userId} />
    </div>
  );
};

export default RecipesPage;
