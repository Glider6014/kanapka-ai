import Header from '@/components/profile/Header';
import Stats from '@/components/profile/Stats';
import UserRecipes from '@/components/profile/UserRecipes';
import connectDB from '@/lib/connectToDatabase';
import { User } from '@/models/User';
import Logo from '@/components/Logo';
import MainNavbar from '@/components/home-page/MainNavbar';
import { Context } from '@/lib/apiUtils';
import mongoose from 'mongoose';

function notFound() {
  return (
    <div className='container mx-auto py-8 flex justify-center'>
      <div className='text-center pt-10'>
        <Logo className='text-5xl md:text-9xl' />
        <p className='mt-4 text-2xl font-bold text-black'>User not found</p>
      </div>
    </div>
  );
}

const ProfilePage = async ({ params }: Context) => {
  await connectDB();

  const { id: userId } = params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return notFound();
  }

  const user = await User.findById(userId);

  if (!user) {
    return notFound();
  }

  return (
    <div className='container mx-auto py-4 px-2 sm:px-4'>
      <MainNavbar />
      <div className='p-4 sm:p-6'>
        <div className='max-w-full sm:max-w-4xl mx-auto'>
          <Header user={user} />
          <Stats userId={userId} />
          <UserRecipes userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
