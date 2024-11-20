"use client";
import { useState } from "react";
import { SearchRecipes } from "@/components/SearchRecipes";
import { RecipesList } from "@/components/RecipesList";

export default function Home() {
  return (
    <>
      <SearchRecipes />
      <RecipesList />
    </>
  );
}
