'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CircleUserRound, LogOut } from 'lucide-react';

type User = {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  avatar: string;
  bgc: string;
  createdAt: string;
};

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchUserData = useCallback(async () => {
    if (session?.user?.id) {
      const response = await fetch(`/api/profile/${session.user.id}`);
      const data = await response.json();
      if (data.user.avatar) {
        setUser(data.user);
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          if (context) {
            const nickname = session.user.username || 'User';
            const firstLetter = nickname.charAt(0).toUpperCase();
            const gradient = context.createLinearGradient(
              0,
              0,
              canvas.width,
              0
            );
            gradient.addColorStop(0, '#7e22ce');
            gradient.addColorStop(1, '#800080');
            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#FFF';
            context.font = 'bold 24px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(
              firstLetter,
              canvas.width / 2,
              canvas.height / 2 + 2
            );
            setUser({ ...data.user, avatar: canvas.toDataURL() });
          }
        }
      }
    }
  }, [session]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const logout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  if (!user) return null;

  return (
    <div className='relative inline-block text-left' ref={dropdownRef}>
      <button
        className='flex items-center justify-center focus:outline-none'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Avatar className='h-10 w-10'>
          <AvatarImage src={user.avatar} alt={`@${user.username}`} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <canvas
          ref={canvasRef}
          className='hidden'
          width={40}
          height={40}
        ></canvas>
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 z-50 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5'>
          <ul className='py-1'>
            <li>
              <button
                className='block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100'
                onClick={() => router.push(`/profile/${session?.user?.id}`)}
              >
                <CircleUserRound className='inline h-4 w-4 mr-2' /> Profile
              </button>
            </li>
            {/* <li>
                  <button
                    className="block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100"
                    onClick={() => router.push("/settings/profile")}
                  >
                    <Settings className="inline h-4 w-4 mr-2" /> Settings
                  </button>
                </li> */}
            <li>
              <button
                className='block w-full px-4 py-2 text-sm text-gray-700 text-left hover:bg-gray-100'
                onClick={logout}
              >
                <LogOut className='inline h-4 w-4 mr-2' /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
