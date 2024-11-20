import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Navbar } from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SearchRecipes = () => {
  const [ingredients, setIngredients] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: ingredients.split(","), count: 5 }),
      });
      if (response.ok) {
        const data = await response.json();
        // Przekieruj lub odśwież listę przepisów po wyszukaniu
        router.refresh();
      } else {
        console.error("Błąd podczas generowania przepisów");
      }
    } catch (error) {
      console.error("Błąd:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setIngredients("");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Navigation Bar */}
      <nav className="mb-4 mt-1 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex justify-between w-full md:w-auto">
          {/* Logo */}
          <Logo mobileFontSize="text-2xl" desktopFontSize="text-3xl" />
          {/* Mobile version */}
          <div className="md:hidden">
            <Navbar />
          </div>
        </div>
        {/* Desktop version */}
        <div className="md:block hidden">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col md:flex-row gap-2 w-full">
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="default"
                    className="text-white bg-gradient-to-r from-purple-700 to-orange-500 hover:opacity-90 transition-opacity duration-200 w-full md:w-auto"
                  >
                    SEARCH RECIPES
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  >
                    LOGIN
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  >
                    REGISTER
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Section - Textarea */}
        <div className="w-full md:w-2/5">
          <Textarea
            className="min-h-[150px] md:min-h-[400px] w-full"
            placeholder="Enter your ingredients here..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
          <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
            <Button
              variant="outline"
              onClick={handleClear}
              className="w-full md:w-1/2"
            >
              Clear
            </Button>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="w-full md:w-1/2"
            >
              {isLoading ? "Szukam..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Right Section - Table */}
        <div className="w-full md:w-3/5 mt-4 md:mt-0">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>RECIPE NAME</TableHead>
                <TableHead>DIFFICULTY</TableHead>
                <TableHead>PREPARATION TIME</TableHead>
                <TableHead>DETAILS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{/* From database */}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
