"use client";
import {
  DropdownMenu,
  DropdownMenuList,
  DropdownMenuItem,
  DropdownMenuLink,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Logo } from "@/components/Logo";
import { useRouter } from "next/navigation";
import { NavbarData } from "@/components/data/navbarData";
import UserDropDownMenu from "./UserDropDownMenu";
import { useSession } from "next-auth/react";

export const Navbar = () => {
  const router = useRouter();
  const navbarItems = NavbarData();
  const { data: session } = useSession();

  return (
    <nav className="my-4 flex flex-col md:flex-row items-center justify-between mx-4 md:mx-0 gap-4 z-50">
      <div className="flex justify-between w-full md:w-auto">
        <Logo className="text-4xl md:text-5xl" />
        <div className="md:hidden flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuList className="flex flex-col gap-2 w-full">
              {navbarItems.map((item, index) => (
                <DropdownMenuItem key={index} className="w-full">
                  <DropdownMenuLink
                    href={item.href ?? "#"}
                    className={`w-full ${item.className}`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(item.href);
                    }}
                  >
                    {item.label.toUpperCase()}
                  </DropdownMenuLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuList>
          </DropdownMenu>
          <UserDropDownMenu />
        </div>
      </div>
      <div className="md:block hidden">
        <NavigationMenu className="w-full">
          <NavigationMenuList className="flex flex-col md:flex-row gap-2 w-full">
            {navbarItems.map((item, index) => (
              <NavigationMenuItem key={index} className="w-full">
                <NavigationMenuLink asChild>
                  <a
                    href={item.href}
                    className={`w-full md:w-auto ${item.className}`}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(item.href);
                    }}
                  >
                    {item.label.toUpperCase()}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <UserDropDownMenu />
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};
