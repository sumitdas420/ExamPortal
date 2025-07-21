// app/admin/manage-users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import LogoutButton from '@/components/LogoutButton';

export default function ManageUsersPage() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetch('/api/admin/manage')
      .then(res => res.json())
      .then(data => setAdmins(data));
  }, []);

  const deleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;

    const res = await fetch('/api/admin/manage', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setAdmins(prev => prev.filter((admin: any) => admin.id !== id));
    } else {
      alert('Failed to delete admin');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Manage Admin Users</h1>
      <LogoutButton />

      <ul className="mt-4 space-y-2">
        {admins.map((admin: any) => (
          <li
            key={admin.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
          >
            <span>{admin.email}</span>
            <button
              onClick={() => deleteAdmin(admin.id)}
              className="text-red-600 text-sm hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
