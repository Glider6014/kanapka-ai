"use client";

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import EditProfileDialog from './EditProfileDialog';
import { useSession } from "next-auth/react";

type HeaderProps = {
  user: {
    id: string;
    displayName: string;
    username: string;
    bio: string,
    avatar: string,
    bgc: string,
    createdAt: string;
  };
};

const Header: React.FC<HeaderProps> = ({ user }) => {
  const joinDate = new Date(user.createdAt).toLocaleString('en-GB', { month: 'long', year: 'numeric' });
  const { data: session } = useSession();
  const isOwner = (session?.user?.id) == user.id;
  
  return (
    <div className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      <div 
        className="relative h-32"
        style={{ 
          backgroundImage: user.bgc ? `url(${user.bgc})` : 'linear-gradient(to right, #7e22ce, #f97316)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {isOwner && (
        <div className="absolute top-2 right-2">
          <EditProfileDialog user={user}/>
        </div>
        )}
      </div>

      <div className="relative -mt-16 pl-6 sm:pl-8">
        <Avatar className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
          <AvatarImage src={user.avatar} alt={`@${user.username}`} />
          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="mt-4">
          <h1 className="text-xl font-bold text-gray-800">{user.displayName}</h1>
          <span className="text-sm text-gray-500">@{user.username}</span>
        </div>

        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            {user.bio}
          </p>
        </div>

        <div className="mt-2 text-gray-500 text-sm">
          <span><Calendar className="w-4 h-4 inline"/> Joined on {joinDate}</span>
        </div>

        {/* <div className="mt-4 text-gray-600">
          <span className="mr-6">
            <strong>0</strong> following
          </span>
          <span>
            <strong>0</strong> followers
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default Header;