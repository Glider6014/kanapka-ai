"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import GeneratedUserRecipes from "./GeneratedUserRecipes";

const UserRecipes = ({ userId }: { userId: string }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-700 mb-4">My Recipes<hr/></h2>
      <GeneratedUserRecipes userId={userId}/>
    </div>
  );
};

export default UserRecipes;
