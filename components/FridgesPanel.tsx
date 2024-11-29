"use client";

import { RecipeType } from "@/models/Recipe";
import { useEffect, useState } from "react";
import { FridgeType } from "@/models/Fridge";

type FrdigesPanelProps = {
  setRecipes: React.Dispatch<React.SetStateAction<RecipeType[]>>;
};

export const FridgesPanel = ({ setRecipes }: FrdigesPanelProps) => {
  const [fridges, setFridges] = useState<FridgeType[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    fetch("/api/fridges")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch fridges");
        }
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        setFridges(data.fridges);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="w-full md:w-2/5">
      <div className="flex border-b">
        {fridges.map((fridge, index) => (
          <button
            key={fridge._id.toString()}
            className={`px-4 py-2 ${
              activeTab === index ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {fridge.name}
          </button>
        ))}
      </div>
      <div className="p-4">
        {fridges.length > 0 && (
          <ul>
            {fridges[activeTab].ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
