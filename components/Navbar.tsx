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
import { buttonVariants } from "@/components/ui/button";

export const Navbar = () => {
  const router = useRouter();
  const navbarItems = NavbarData();

  return (
    <nav className="mb-4 mt-1 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex justify-between w-full md:w-auto">
        <Logo className="text-4xl md:text-5xl" />
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuList className="flex flex-col gap-2 w-full">
              {navbarItems.map((item, index) => (
                <DropdownMenuItem key={index} className="w-full">
                  <DropdownMenuLink
                    href={item.href}
                    className={`w-full ${buttonVariants({
                      variant: item.label === "Home" ? "default" : "outline",
                    })} ${item.className}`}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      } else if (item.href.startsWith("/")) {
                        e.preventDefault();
                        router.push(item.href);
                      }
                    }}
                  >
                    {item.label.toUpperCase()}
                  </DropdownMenuLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuList>
          </DropdownMenu>
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
                    className={`w-full md:w-auto ${buttonVariants({
                      variant: item.label === "Home" ? "default" : "outline",
                    })} ${item.className}`}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      } else if (item.href.startsWith("/")) {
                        e.preventDefault();
                        router.push(item.href);
                      }
                    }}
                  >
                    {item.label.toUpperCase()}
                  </a>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};
