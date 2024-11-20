import { Navbar } from "@/components/Navbar";
import { SearchPanel } from "@/components/SearchPanel";
import { RecipesTable } from "@/components/RecipesTable";

export const SearchRecipes = () => {
  return (
    <div className="container mx-auto p-4">
      <Navbar />
      <div className="flex flex-col md:flex-row gap-4">
        <SearchPanel />
        <RecipesTable />
      </div>
    </div>
  );
};
