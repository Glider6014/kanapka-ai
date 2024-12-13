"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UserDropDownMenu from "../UserDropDownMenu";

const components = [
  {
    title: "Recipe Generator",
    href: "/dashboard",
    description: "Generate custom recipes based on your preferences.",
  },
  {
    title: "Meal Planning",
    href: "/meal-planner",
    description: "Plan your meals for the week with ease.",
  },
  {
    title: "Recipes List",
    href: "/recipes",
    description: "Get information on all recipes in the database.",
  },
  {
    title: "Shopping List",
    href: "/shopping-list",
    description: "Generate a shopping list based on your meal plan.",
  },
];

export const MainNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="relative flex items-center justify-between pl-4 pr-5 md:px-0 py-0 md:py-2 max-w-full mx-auto">
      <div className="flex items-center space-x-4">
        <Logo className="text-3xl md:text-4xl" />
        <NavigationMenu className="hidden lg:flex items-center space-x-4">
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Features</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Kanapka AI
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Your AI-powered recipe and meal planning assistant.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Community
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="hidden lg:flex items-center space-x-4 z-50">
        {session?.user?.id ? (
          <div className="flex items-center space-x-4">
            <UserDropDownMenu />
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              className="bg-black hover:bg-black hover:text-white text-white font-bold w-full md:w-auto"
              onClick={() => (window.location.href = "/user/signin")}
            >
              LOGIN
            </Button>
            <Button
              variant="outline"
              className="text-white font-bold bg-gradient-to-r from-purple-primary to-orange-primary w-full md:w-auto hover:text-white"
              onClick={() => (window.location.href = "/user/signup")}
            >
              Get started for free
            </Button>
          </>
        )}
      </div>

      <button
        className="block lg:hidden"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isMobileMenuOpen && (
        <div className="absolute top-12 left-0 right-0 bg-white shadow-md p-4 lg:hidden z-10">
          <ul className="space-y-4">
            {session?.user?.id ? (
              <>
                <li>
                    <Link href={`/profile/${session?.user?.id}`} passHref>
                      <span className="block text-gray-800 hover:text-black">
                        Profile
                      </span>
                    </Link>
                </li>
                {/* <li>
                  <button
                    className="block text-gray-800 hover:text-black"
                    onClick={() => router.push(`/settings`)}
                  >
                    Settings
                  </button>
                </li> */}
              </>
            ) : (
              <>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                  <Link href="/user/signin" passHref>
                    <span className="block text-gray-800 hover:text-black">
                      Login
                    </span>
                  </Link>
                </div>
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
                  <Link href="/user/signup" passHref>
                    <span className="block text-gray-800 hover:text-black">
                      Get started for free
                    </span>
                  </Link>
                </div>
              </>
            )}
            <li>
              <Link href="/community" passHref>
                <span className="block text-gray-800 hover:text-black">
                  Community
                </span>
              </Link>
            </li>
            <li>
              <Link href="/pricing" passHref>
                <span className="block text-gray-800 hover:text-black">
                  Pricing
                </span>
              </Link>
            </li>
            {components.map((component) => (
              <li key={component.title}>
                <Link href={component.href} passHref>
                  <span className="block text-gray-800 hover:text-black">
                    {component.title}
                  </span>
                </Link>
              </li>
            ))}

            {session?.user?.id ? (
              <>
                <li>
                  <Link href="/" passHref>
                  <span
                    className="block text-gray-800 hover:text-black cursor-pointer"
                    onClick={logout}
                  >
                    Logout
                  </span>
                  </Link>
                </li>
              </>
            ) : (
              <></>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
