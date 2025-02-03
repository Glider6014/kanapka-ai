'use client';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const DropdownMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className={cn('relative', className)} {...props}>
      <a
        onClick={(e) => {
          e.preventDefault();
          toggleMenu();
        }}
        href='#'
        className='inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:border-gray-600 dark:focus:ring-gray-600'
        aria-controls='dropdown-menu'
        aria-expanded={isMenuOpen}
      >
        <span className='sr-only'>Open main menu</span>
        <svg
          className='w-5 h-5'
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 17 14'
        >
          <path
            stroke='currentColor'
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M1 1h15M1 7h15M1 13h15'
          />
        </svg>
      </a>
      {isMenuOpen && (
        <div
          className='absolute z-50 top-full mt-2 right-0 w-48 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 shadow-lg'
          id='dropdown-menu'
        >
          {children}
        </div>
      )}
    </div>
  );
});
DropdownMenu.displayName = 'DropdownMenu';

const DropdownMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn('flex flex-col font-medium', className)}
    {...props}
  />
));
DropdownMenuList.displayName = 'DropdownMenuList';

const DropdownMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('block py-2 px-3', className)} {...props} />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

const DropdownMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, onClick, ...props }, ref) => (
  <a
    ref={ref}
    className={cn('block py-2 px-3', className)}
    onClick={(e) => {
      if (onClick) {
        e.preventDefault();
        onClick(e);
      }
    }}
    {...props}
  />
));
DropdownMenuLink.displayName = 'DropdownMenuLink';

export { DropdownMenu, DropdownMenuList, DropdownMenuItem, DropdownMenuLink };
