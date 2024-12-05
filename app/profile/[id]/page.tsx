import Header from '@/components/profile/Header';
import Stats from '@/components/profile/Stats';
import { Navbar } from '@/components/Navbar';
import UserRecipes from '@/components/profile/UserRecipes';
import connectDB from '@/lib/connectToDatabase';
import User from '@/models/User';
import mongoose from 'mongoose'; 

const ProfilePage = async ({ params }: { params: { id: string } }) => {
  await connectDB();
  const { id } = params;

  try {
    const user = await User.findById(id);

    return (
      <div className="container mx-auto py-4 px-2 sm:px-4">
        <Navbar />
        <div className="p-4 sm:p-6">
          <div className="max-w-full sm:max-w-4xl mx-auto">
            <Header user={user} />
            <Stats user={user} />
            <UserRecipes user={user} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching user:', error);
    return <div>User not found</div>;
  }
};

export default ProfilePage;