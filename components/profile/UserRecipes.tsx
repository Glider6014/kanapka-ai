"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Recipe = {
  _id: string;
  name: string;
  description: string;
};

const UserRecipes = ({ userId }: { userId: string }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`/api/profile/${userId}`);
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">My Recipes<hr/></h2>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
              <Link href={`/recipes/${recipe._id}`}>
                <h3 className="text-lg font-semibold text-gray-800 text-center">{recipe.name}</h3>
              </Link>
              <p className="text-sm text-gray-600 text-center">{recipe.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecipes;
