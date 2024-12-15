import Sidebar from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <div className='container mx-auto p-4'>
      <Navbar />
      <div className='flex flex-col md:flex-row gap-4 mt-4'>
        <Sidebar />

        <div className='flex-1 p-6 md:ml-72'></div>
      </div>
    </div>
  );
}
