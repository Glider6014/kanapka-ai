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

const GeneratedUserRecipes = ({ userId }: { userId: string }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limitRecipesPerPage = 12;

  const fetchRecipes = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limitRecipesPerPage;
      const response = await fetch(
        `/api/recipes?offset=${offset}&limit=${limitRecipesPerPage}&createdBy=${userId}`
      );
      const data = await response.json();

      setRecipes(data.results || []);
      setTotalPages(Math.ceil(data.count / limitRecipesPerPage));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageRange = () => {
    const range = 3;
    const start = Math.max(1, currentPage - range);
    const end = Math.min(totalPages, currentPage + range);

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <>
      {recipes.length === 0 ? (
        <p className="text-gray-600">No recipes found.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
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

          <Pagination className="mt-5 overflow-x-auto">
            <PaginationContent className="cursor-pointer">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>

              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(1)}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {getPageRange().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageChange(totalPages)}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

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

export default GeneratedUserRecipes;