import Header from '@/components/profile/Header';
import Stats from '@/components/profile/Stats';
import { Navbar } from '@/components/Navbar';
import UserRecipes from '@/components/profile/UserRecipes';
import connectDB from '@/lib/connectToDatabase';
import User from '@/models/User';

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  await connectDB();
  const { id } = params;

  
  const user = await User.findById(id);
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4">
      <Navbar />
      <div className="p-4 sm:p-6">
        <div className="max-w-full sm:max-w-4xl mx-auto">
          <Header user={{
            username: user.username,
            createdAt: user.createdAt.toISOString()
          }} />
          <Stats userId={id}/>
          <UserRecipes userId={id} />
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
