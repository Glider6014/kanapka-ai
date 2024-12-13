'use client';
import SearchPanel from '@/components/SearchPanel';
import { RecipesList } from '@/components/RecipesList';
import { RecipeType } from '@/models/Recipe';
import { useState } from 'react';

export default function ListIngredientsAndListRecipesSection() {
  const [recipes, setRecipes] = useState<RecipeType[]>([]);

  return (
    <div className='flex flex-col md:flex-row gap-4'>
      <SearchPanel setRecipes={setRecipes} />
      <div className='w-full md:w-3/5 mt-4 md:mt-0'>
        <RecipesList recipes={recipes} />
      </div>
    </div>
  );
}
