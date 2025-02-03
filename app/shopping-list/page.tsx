import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ShoppingListPage from '@/components/shopping-list/ShoppingListPage';

export default async function Page() {
  const session = await getServerSession();

  if (!session) redirect('/user/signin');

  return <ShoppingListPage />;
}
