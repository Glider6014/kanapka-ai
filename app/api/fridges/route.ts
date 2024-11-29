import { NextResponse } from "next/server";
import {
  withApiErrorHandling,
  getServerSessionOrCauseUnathorizedError,
} from "@/lib/apiUtils";
import Fridge from "@/models/Fridge";
import connectDB from "@/lib/connectToDatabase";

export const GET = withApiErrorHandling(async () => {
  await connectDB();

  const session = await getServerSessionOrCauseUnathorizedError();

  const userId = session.user.id;
  const fridges = await Fridge.find({
    $or: [{ owner: userId }, { members: { $in: [userId] } }],
  }).populate("members");

  return NextResponse.json({
    fridges: fridges.map((fridge) => ({
      id: fridge._id,
      name: fridge.name,
      ingredients: fridge.ingredients,
    })),
  });
});
