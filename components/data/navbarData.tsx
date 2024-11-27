import { signOut } from "next-auth/react";

let standardStyle =
  "text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

const logout = async () => {
  await signOut({ callbackUrl: "/user/status" });
};

export const NavbarData = () => {
  return [
    {
      label: "Home",
      href: "#",
      className:
        "text-white bg-gradient-to-r from-purple-700 to-orange-500 rounded dark:bg-blue-600",
    },
    {
      label: "Dashboard",
      href: "/",
      className: standardStyle,
    },
    {
      label: "Recipes",
      href: "/recipes",
      className: standardStyle,
    },
    {
      label: "Logout",
      href: "#",
      className: standardStyle,
      onClick: logout,
    },
  ];
};
