'use client';

import LogoutButton from '@/components/LogoutButton';

export default function Topbar() {
  return (
    <header className="bg-white shadow p-4 flex items-center justify-between md:hidden">
      <h1 className="text-lg font-semibold">Admin Panel</h1>
      <LogoutButton />
    </header>
  );
}
