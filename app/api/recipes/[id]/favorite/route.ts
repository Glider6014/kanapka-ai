import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/connectToDatabase";
import Recipe from "@/models/Recipe";

export type GETParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: GETParams) {}
