'use client';

import { UserPermissions } from '@/lib/permissions';
import { UserType } from '@/models/User';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const truncateEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  const truncLocal = local.length > 4 ? local.slice(0, 4) + '...' : local;
  const truncDomain =
    domain.length > 12 ? domain.slice(0, 8) + '...' + domain.slice(-4) : domain;
  return `${truncLocal}@${truncDomain}`;
};

export type UsersTableRowProps = {
  user: UserType;
  editPermissionsMode: boolean;
};

export function UsersTableRow({
  user,
  editPermissionsMode,
}: UsersTableRowProps) {
  const [userData, setUserData] = useState(user);
  const [addPermissionMode, setAddPermissionMode] = useState(false);

  const handleEmailClick = async () => {
    await navigator.clipboard.writeText(user.email);
  };

  const handleDeletePermission = async (
    permissionToDelete: UserPermissions | string
  ) => {
    const updatedPermissions = user.permissions.filter(
      (permission) => permission !== permissionToDelete
    );

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: updatedPermissions }),
      });

      if (!response.ok) {
        throw new Error('Failed to update permissions');
      }

      const body = await response.json();

      setUserData({
        ...userData,
        permissions: body.permissions,
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleAddPermission = async (permission: UserPermissions) => {
    const updatedPermissions = [...userData.permissions, permission];

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions: updatedPermissions }),
      });

      if (!response.ok) throw new Error('Failed to update permissions');

      const body = await response.json();
      setUserData({
        ...userData,
        permissions: body.permissions,
      });
      setAddPermissionMode(false);
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <tr className='hover:bg-gray-100'>
      <td className='px-6 py-4 whitespace-nowrap w-[25ch]'>
        {userData.username} - {userData.displayName}
      </td>
      <td className='px-6 py-4 whitespace-nowrap w-[20ch]'>
        <span
          className='cursor-pointer'
          title={userData.email}
          onClick={handleEmailClick}
        >
          {truncateEmail(userData.email)}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <ul className='flex flex-wrap gap-x-2 gap-y-1'>
          {userData.permissions.map((permission) => (
            <div
              key={permission}
              className='px-2 py-1 text-xs bg-blue-100 text-start-prim rounded flex items-center gap-1'
            >
              <span>{permission}</span>
              {editPermissionsMode && (
                <button
                  className='text-black'
                  onClick={() => handleDeletePermission(permission)}
                >
                  <X className='w-4 h-4' />
                </button>
              )}
            </div>
          ))}
          {editPermissionsMode && (
            <>
              <button
                className='bg-green-200 hover:bg-green-300 rounded-md p-1'
                onClick={() => setAddPermissionMode(true)}
              >
                <Plus className='w-4 h-4' />
              </button>
              {addPermissionMode && (
                <div
                  className='absolute z-10 mt-1 w-48 bg-white border rounded-md shadow-lg'
                  onBlur={() => setAddPermissionMode(false)}
                >
                  {Object.values(UserPermissions)
                    .filter(
                      (permission) => !userData.permissions.includes(permission)
                    )
                    .map((permission) => (
                      <button
                        key={permission}
                        className='block w-full text-left px-4 py-2 hover:bg-gray-100'
                        onClick={() => handleAddPermission(permission)}
                      >
                        {permission}
                      </button>
                    ))}
                </div>
              )}
            </>
          )}
        </ul>
      </td>
      <td className='px-2 py-2 whitespace-nowrap w-4'>
        {/* <button
          onClick={() => 0}
          className="text-white p-3 bg-red-500 hover:bg-red-600 rounded-md"
        >
          <Trash2 className="w-5 h-5" />
        </button> */}
      </td>
    </tr>
  );
}
