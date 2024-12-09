"use client";

import React, { useEffect, useState } from "react";

const Stats = ({ userId }: { userId: string }) => {
  const [generatedRecipesCount, setGeneratedRecipesCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchGeneratedRecipesCount = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setGeneratedRecipesCount(data.count_recipes);
        } else {
          console.error("Failed to fetch recipes count");
        }
      } catch (error) {
        console.error("Error fetching recipes count:", error);
      }
    };

    fetchGeneratedRecipesCount();
  }, []);

  return (
    <div className="bg-gray-100 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-700 mb-4">
        Stats
        <hr />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 text-center shadow-md">
          <span className="block text-sm text-gray-500 uppercase">Generated Recipes</span>
          <span className="block text-2xl font-bold text-blue-500 mt-2">
            {generatedRecipesCount !== null ? generatedRecipesCount : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Stats;
