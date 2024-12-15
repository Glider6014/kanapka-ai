import { Navbar } from '@/components/Navbar';
import { RecipesList } from '@/components/RecipesList';
import connectDB from '@/lib/connectToDatabase';
import { Recipe } from '@/models/Recipe';

const RecipesPage = async () => {
  await connectDB();
  const recipes = await Recipe.find({}).populate('ingredients.ingredient');

  return (
    <>
      <div className='container mx-auto'>
        <Navbar />
      </div>
      <div className='container pb-4 mx-auto overflow-hidden z-10'>
        <h2 className='text-2xl font-bold mb-4 text-center bg-gray-300 p-5 text-gray-700 z-10'>
          Recipes List
        </h2>
        <RecipesList
          recipes={JSON.parse(JSON.stringify(recipes))}
          hasFilters={true}
        />
      </div>
    </>
  );
};

export default RecipesPage;
