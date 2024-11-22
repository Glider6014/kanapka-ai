"use client";
import { Navbar as DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="mb-4 mt-1 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex justify-between w-full md:w-auto">
        <Logo mobileFontSize="text-2xl" desktopFontSize="text-3xl" />
        <div className="md:hidden">
          <DropdownMenu />
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
                  SEARCH RECIPES
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem className="w-full">
              <NavigationMenuLink asChild>
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-100 w-full md:w-auto"
                  onClick={() => router.push("/user/signin")}
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
                  onClick={() => router.push("/user/signup")}
                >
                  REGISTER
                </Button>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};
