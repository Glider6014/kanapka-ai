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

export const SearchRecipes = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Navigation Bar */}
      <nav className="mb-4 mt-1 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex justify-between w-full md:w-auto">
          <a
            href="/"
            className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-700 to-orange-500 bg-clip-text text-transparent"
          >
            Kanapka AI
          </a>
          <div className="md:hidden">
            <Navbar />
          </div>
        </div>
        <div className="md:block hidden">
          <NavigationMenu className="w-full">
            <NavigationMenuList className="flex flex-col md:flex-row gap-2 w-full">
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="default"
                    className="text-white bg-gradient-to-r from-purple-700 to-orange-500 hover:opacity-90 transition-opacity duration-200 w-full md:w-auto"
                  >
                    WYSZUKAJ RECEPTURY
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  >
                    LOGOWANIE
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem className="w-full">
                <NavigationMenuLink asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  >
                    REJESTRACJA
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
            placeholder="Wpisz składniki..."
          />
          <div className="mt-4 flex flex-col md:flex-row justify-between gap-2">
            <Button variant="outline" className="w-full md:w-auto">
              Wyczyść
            </Button>
            <Button className="w-full md:w-auto">Szukaj</Button>
          </div>
        </div>

        {/* Right Section - Table */}
        <div className="w-full md:w-3/5 mt-4 md:mt-0">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>NAZWA RECEPTURY</TableHead>
                <TableHead>TRUDNOŚĆ POTRAWY</TableHead>
                <TableHead>ŁĄCZNY CZAS PRZYGOTOWANIA</TableHead>
                <TableHead>SZCZEGÓŁY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{/* From database */}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
