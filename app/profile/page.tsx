import Stats from '@/components/profile/Stats';
import Header from '@/components/profile/Header';
import {Navbar} from '@/components/Navbar';
import UserRecipes from '@/components/profile/UserRecipes';

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-4">
      <Navbar />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Header />
          <Stats />
          <UserRecipes />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
