import Header from "@/components/profile/Header";
import Stats from "@/components/profile/Stats";
import UserRecipes from "@/components/profile/UserRecipes";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { Logo } from "@/components/Logo";
import { ObjectId } from "mongodb";
import { MainNavbar } from "@/components/home-page/MainNavbar";
import { Context } from "@/lib/apiUtils";

function notFound() {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <div className="text-center pt-10">
        <Logo className="text-5xl md:text-9xl" />
        <p className="mt-4 text-2xl font-bold text-black">User not found</p>
      </div>
    </div>
  );
}

const ProfilePage = async ({ params }: Context) => {
  await connectDB();
  const { id } = params;
  if (!ObjectId.isValid(id)) {
    return notFound();
  }
  const user = await User.findById(new ObjectId(id));

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <MainNavbar />
      <div className="p-4 sm:p-6">
        <div className="max-w-full sm:max-w-4xl mx-auto">
          <Header
            user={{
              id: user._id.toString(),
              username: user.username,
              displayName: user.displayName,
              bio: user.bio || "",
              avatar: user.avatar || "",
              bgc: user.bgc || "",
              createdAt: user.createdAt.toISOString(),
            }}
          />
          <Stats userId={id} />
          <UserRecipes userId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
