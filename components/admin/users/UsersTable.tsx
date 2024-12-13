'use client';

import { UserType } from '@/models/User';
import { useState } from 'react';
import { UsersTableRow } from './UsersTableRow';

export type UsersTableProps = {
  users: UserType[];
};

export default function UsersTable({ users }: UsersTableProps) {
  const [editPermissionsMode, setEditPermissionsMode] = useState(false);

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white border border-gray-300 rounded-lg'>
        <thead className='bg-gray-100'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Username - Display Name
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              Email
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
              <span>Permissions</span>
              <button
                className='ml-2 text-black'
                onClick={() => setEditPermissionsMode(!editPermissionsMode)}
              >
                {editPermissionsMode ? 'View' : 'Edit'}
              </button>
            </th>
            <th className='py-3 text-left text-xs font-medium text-gray-500 uppercase'></th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 overflow-y-auto'>
          {users.map((user) => (
            <UsersTableRow
              key={user.username}
              user={user}
              editPermissionsMode={editPermissionsMode}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
