"use client";

import React from "react";
import { useSession } from "next-auth/react";
import GeneratedUserRecipes from "./GeneratedUserRecipes";
import FavoriteUserRecipes from "./FavoriteUserRecipes";
import { Lock } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const UserRecipes = ({ userId }: { userId: string }) => {
  const { data: session } = useSession();
  const isOwner = (session?.user?.id) == userId;

  return (
    <Tabs defaultValue="GeneratedUserRecipes" className="bg-gray-100 pr-6 pl-6 pb-6 rounded-lg shadow-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="GeneratedUserRecipes">My recipes</TabsTrigger>
        {isOwner && (
            <TabsTrigger value="FavoriteUserRecipes">Likes</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="GeneratedUserRecipes">
        <GeneratedUserRecipes userId={userId}/>
      </TabsContent>
      {isOwner && ( 
        <TabsContent value="FavoriteUserRecipes">
          <div className="mb-4 text-white italic text-sm flex items-center space-x-2 bg-start-prim-foreground bg-opacity-60 p-2 rounded-lg shadow-sm">
            <Lock /> <span className="text-white opacity-100">Your likes are private. Only you can see them.</span>
          </div>
          <FavoriteUserRecipes userId={userId}/>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default UserRecipes;