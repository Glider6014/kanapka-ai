"use client";
import { useState, useEffect } from "react";
import { UserType } from "@/models/User";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");

    if (!res.ok) {
      console.error(await res.json());
    }

    setUsers(await res.json());

    setLoading(false);
  };

  const updateUser = async (userId: string, data: Partial<UserType>) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) fetchUsers();
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });
    if (res.ok) fetchUsers();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id.toString()}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select
                  multiple
                  value={user.permissions}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (o) => o.value
                    );
                    updateUser(user._id.toString(), { permissions: selected });
                  }}
                >
                  <option value="read:recipes">Read Recipes</option>
                </select>
              </td>
              <td>
                <button
                  onClick={() => deleteUser(user._id.toString())}
                  className="text-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
