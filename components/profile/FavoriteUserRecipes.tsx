"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Recipe = {
  _id: string;
  name: string;
  description: string;
};

const FavoriteUserRecipes = ({ userId }: { userId: string }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitRecipesPerPage = 12;

  const fetchFavoriteRecipes = async (page: number) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      const data = await response.json();

      setFavoriteRecipes(data.favoriteRecipes || []);
      setTotalPages(
        Math.max(1, Math.ceil(data.favoriteRecipes.length / limitRecipesPerPage))
      );
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoriteRecipes(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedRecipes = favoriteRecipes.slice(
    (currentPage - 1) * limitRecipesPerPage,
    currentPage * limitRecipesPerPage
  );

  if (loading) {
    return <div>Loading favorite recipes...</div>;
  }

  return (
    <>
      {favoriteRecipes.length === 0 ? (
        <p className="text-gray-600">No favorite recipes found.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
              >
                <Link href={`/recipes/${recipe._id}`}>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {recipe.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 text-center">
                  {recipe.description}
                </p>
              </div>
            ))}
          </div>

          <Pagination className="mt-5">
            <PaginationContent className="cursor-pointer flex space-x-2">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default FavoriteUserRecipes;
