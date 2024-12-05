import { signOut } from "next-auth/react";
import { buttonVariants } from "../ui/button";

const standardStyle = `text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${buttonVariants(
  { variant: "outline" }
)}`;

const logout = async () => {
  await signOut({ callbackUrl: "/" });
};

export const NavbarData = () => {
  return [
    {
      label: "Home",
      href: "/",
      className: `text-white bg-gradient-to-r from-start-prim to-end-prim rounded ${buttonVariants(
        { variant: "default" }
      )}`,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      className: standardStyle,
    },
    {
      label: "Recipes",
      href: "/recipes",
      className: standardStyle,
    },
    {
      label: "Meal planner",
      href: "/meal-planner",
      className: standardStyle,
    },
    // {
    //   label: "Logout",
    //   className: standardStyle,
    //   onClick: logout,
    // },
  ];
};
