'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className='w-full md:w-72 bg-white shadow-md z-10 md:fixed md:h-full'>
      <nav className='flex flex-col space-y-2 p-4'>
        <Link href='/settings/profile'>
          <span
            className={`block px-4 py-2 rounded-md text-sm font-medium text-gray-700 
              ${
                isActive('/settings/profile')
                  ? 'bg-gray-100 border-l-4 border-start-prim'
                  : 'hover:bg-gray-100'
              }`}
          >
            Profile
          </span>
        </Link>
        <Link href='/settings/account'>
          <span
            className={`block px-4 py-2 rounded-md text-sm font-medium text-gray-700 
              ${
                isActive('/settings/account')
                  ? 'bg-gray-100 border-l-4 border-start-prim'
                  : 'hover:bg-gray-100'
              }`}
          >
            Account
          </span>
        </Link>
        <Link href='/settings/notification'>
          <span
            className={`block px-4 py-2 rounded-md text-sm font-medium text-gray-700 
              ${
                isActive('/settings/notification')
                  ? 'bg-gray-100 border-l-4 border-start-prim  '
                  : 'hover:bg-gray-100'
              }`}
          >
            Notifications
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
