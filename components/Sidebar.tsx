"use client"

import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="w-full md:w-72 bg-white shadow-md z-10 md:fixed md:h-full">
            <nav className="flex flex-col space-y-2 p-4">
                <Link href="/settings/profile">
                  <span className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 text-gray-700">
                    Profile
                  </span>
                </Link>
                <Link href="/settings/account">
                  <span className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 text-gray-700">
                    Account
                  </span>
                </Link>
                <Link href="/settings/notification">
                  <span className="block px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 text-gray-700">
                    Notifications
                  </span>
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;
