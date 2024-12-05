import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";

const AvatarDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const { data: session } = useSession();

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const nickname = session?.user?.username || "CN";
        const firstLetter = nickname.charAt(0).toUpperCase();
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, "#7e22ce");
        gradient.addColorStop(1, "#800080");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#FFF";
        context.font = "bold 24px Arial"; // Smaller font size
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(firstLetter, canvas.width / 2, canvas.height / 2 + 2); // Adjusted position
        setAvatarUrl(canvas.toDataURL());
      }
    }
  }, [session]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <canvas
        ref={canvasRef}
        width={40}
        height={40}
        style={{ display: "none" }}
      />
      <button
        className="flex items-center justify-center focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
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
