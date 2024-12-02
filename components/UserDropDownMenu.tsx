import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";

const AvatarDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

    const logout = async () => {
    await signOut({ callbackUrl: "/" });
    };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        className="flex items-center justify-center focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="py-1">
            <li>
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => console.log("Profile clicked")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => console.log("Settings clicked")}
              >
                Settings
              </button>
            </li>
            <li>
              <button
                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={logout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;