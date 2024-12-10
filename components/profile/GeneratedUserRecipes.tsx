"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type Recipe = {
  _id: string;
  name: string;
  description: string;
};

const GeneratedUserRecipes = ({ userId }: { userId: string }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(12);

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

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  const totalPages = Math.ceil(recipes.length / recipesPerPage);

  return (
    <>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRecipes.map((recipe) => (
              <div key={recipe._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
                <Link href={`/recipes/${recipe._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{recipe.name}</h3>
                </Link>
                <p className="text-sm text-gray-600 text-center">{recipe.description}</p>
              </div>
            ))}
          </div>

          <Pagination className="mt-5">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) paginate(currentPage - 1);
                  }}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(index + 1);
                    }}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) paginate(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default GeneratedUserRecipes;