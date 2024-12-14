import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';
import connectDB from '@/lib/connectToDatabase';
import User from '@/models/User';
import Recipe from '@/models/Recipe';
import { Context, processApiHandler } from '@/lib/apiUtils';

const handleGET = async (_req: NextRequest, { params }: Context) => {
  await connectDB();

  const { id } = params;

  if (!isValidObjectId(id)) {
    return NextResponse.json(
      { error: 'Invalid user ID format' },
      { status: 400 }
    );
  }

  const user = await User.findById(id);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const recipes = await Recipe.find({ createdBy: id }).populate(
    'ingredients.ingredient'
  );
  const favoriteRecipes = await Recipe.where('_id').in(user.favorites);
  const countRecipes = await Recipe.countDocuments({ createdBy: id });
  const countFavoriteRecipes = user.favorites.length;

  return NextResponse.json({
    user,
    recipes,
    favoriteRecipes,
    countRecipes,
    countFavoriteRecipes,
  });
};

export const GET = processApiHandler(handleGET);
