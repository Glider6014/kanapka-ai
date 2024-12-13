'use client';
import { useState, useEffect } from 'react';
import { UserType } from '@/models/User';
import { useRouter } from 'next/navigation';
import UsersTable from '@/components/admin/users/UsersTable';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');

    if (!res.ok) {
      const { error } = await res.json();
      alert(error);
      router.push('/user/signin');
      return;
    }

    setUsers(await res.json());
    setLoading(false);
  };

  const updateUser = async (userId: string, data: Partial<UserType>) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure?')) return;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (res.ok) fetchUsers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold text-center mb-4'>Users</h1>
      <UsersTable users={users} />
    </div>
  );
}
