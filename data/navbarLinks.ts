import { buttonVariants } from '@/components/ui/button';

const standardStyle = `text-gray-900 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${buttonVariants(
  { variant: 'outline' }
)}`;

export const NavbarLinks = [
  {
    label: 'Home',
    href: '/',
    className: `text-white bg-gradient-to-r from-start-prim to-end-prim rounded ${buttonVariants(
      { variant: 'default' }
    )}`,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    className: standardStyle,
  },
  {
    label: 'Recipes',
    href: '/recipes',
    className: standardStyle,
  },
  {
    label: 'Meal planner',
    href: '/meal-planner',
    className: standardStyle,
  },
  {
    label: 'Shopping list',
    href: '/shopping-list',
    className: standardStyle,
  },
];