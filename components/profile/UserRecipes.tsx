import React from 'react';

type Recipe = {
  title: string;
  description: string;
  image: string;
};

const recipes: Recipe[] = [
  {
    title: "Spaghetti Bolognese",
    description: "A classic Italian pasta dish with rich meat sauce.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzYWcUVg_I6A6RSYQ-HKY4Szdq7tBFTc65Eg&s",
  },
  {
    title: "Chicken Caesar Salad",
    description: "A fresh salad with grilled chicken, croutons, and Caesar dressing.",
    image: "https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg",
  },
  {
    title: "Vegetable Stir Fry",
    description: "A quick and healthy stir fry with fresh vegetables and soy sauce.",
    image: "https://www.shutterstock.com/image-photo/fried-salmon-steak-cooked-green-600nw-2489026949.jpg",
  },
];

const UserRecipes = () => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">My Recipes<hr/></h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-40 object-cover rounded-lg mb-4 sm:h-48 lg:h-56"
            />
            <h3 className="text-lg font-semibold text-gray-800 text-center">{recipe.title}</h3>
            <p className="text-sm text-gray-600 text-center">{recipe.description}</p>
            </div>
        ))}
      </div>
    </div>
  );
};

export default UserRecipes;
