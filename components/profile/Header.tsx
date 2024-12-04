import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Calendar } from "lucide-react";

const Header = () => {
  const joinDate = "April 2024"; 
  return (
    <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-blue-400 to-blue-600">
        <button className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full shadow-md hover:bg-gray-200">
          <Pencil className="w-4 h-4"/>
        </button>
      </div>

      <div className="relative -mt-16 pl-6 sm:pl-8">
        <Avatar className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-800">wiktor666</h1>
          <span className="text-sm text-gray-500">@wiktor666324234</span>
        </div>

        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            This is where the user’s bio will go. It’s a short description of the user’s interests, role, or something else!
          </p>
        </div>

        <div className="mt-2 text-gray-500 text-sm">
          <span><Calendar className="w-4 h-4 inline"/> Joined on {joinDate}</span>
        </div>

        <div className="mt-4 text-gray-600">
          <span className="mr-6">
            <strong>0</strong> following
          </span>
          <span>
            <strong>0</strong> followers
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;