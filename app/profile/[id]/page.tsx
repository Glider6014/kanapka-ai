import Header from "@/components/profile/Header";
import Stats from "@/components/profile/Stats";
import { Navbar } from "@/components/Navbar";
import UserRecipes from "@/components/profile/UserRecipes";
import connectDB from "@/lib/connectToDatabase";
import User from "@/models/User";
import { Context } from "@/lib/apiUtils";

const ProfilePage = async ({ params }: Context) => {
  await connectDB();
  const { id } = params;

  const user = await User.findById(id);
  if (!user) {
    return <div>User not found</div>;
  }

  // console.log("Raw user:", user);

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <Navbar />
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
