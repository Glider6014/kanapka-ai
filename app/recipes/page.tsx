import { MainNavbar } from "@/components/home-page/MainNavbar";
import { Navbar } from "@/components/Navbar";
import { RecipesList } from "@/components/RecipesList";
import connectDB from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

const RecipesPage = async () => {
  await connectDB();
  const recipes = await Recipe.find({})
    .populate("ingredients.ingredient")
    .lean();

  return (
    <>
      <div className="w-full md:px-4 py-4">
        <MainNavbar />
      </div>
      <div className="container py-4 mx-auto overflow-hidden">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gray-300 p-5 text-gray-700">
          Recipes List
        </h2>
        <RecipesList recipes={JSON.parse(JSON.stringify(recipes))} />
      </div>
    </>
  );
};

export default RecipesPage;
