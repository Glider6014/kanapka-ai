'use client';

import { useEffect, useState } from 'react';
import { FridgeType } from '@/models/Fridge';
import { FridgePanel } from './FridgePanel';

type FridgesPanelProps = {
  setIngredients?: React.Dispatch<React.SetStateAction<string[]>>;
  isSearchRecipesButtonVisible?: boolean;
  isSearchRecipesButtonDisabled?: boolean;
  searchRecipes?: (ingredients: string[]) => void;
};

export const FridgesPanel = ({
  setIngredients,
  isSearchRecipesButtonVisible,
  isSearchRecipesButtonDisabled,
  searchRecipes,
}: FridgesPanelProps) => {
  const [fridges, setFridges] = useState<FridgeType[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetch('/api/fridges')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch fridges');
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setFridges(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className='w-full md:w-2/5'>
      <div className='flex border-b'>
        {fridges.map((fridge, index) => (
          <button
            key={fridge.id}
            className={`px-4 py-2 ${
              activeTab === index ? 'border-b-2 border-end-prim' : ''
            }`}
            onClick={() => handleTabClick(index)}
          >
            {fridge.name}
          </button>
        ))}
      </div>
      <div className='p-4'>
        {fridges.map(
          (fridge, index) =>
            activeTab === index && (
              <FridgePanel
                key={fridge.id}
                fridge={fridge}
                setIngredients={setIngredients}
                isSearchRecipesButtonVisible={isSearchRecipesButtonVisible}
                isSearchRecipesButtonDisabled={isSearchRecipesButtonDisabled}
                searchRecipes={searchRecipes}
              />
            )
        )}
      </div>
    </div>
  );
};
