'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';
import QueryProvider from '@/components/QueryProvider';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth >= 768) setSidebarOpen(true);
    else setSidebarOpen(false);
  }, [windowWidth]);

  const isMobile = windowWidth < 768;

  return (
    <QueryProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black bg-opacity-40 z-30"
            aria-hidden="true"
          />
        )}
        <div
          className={cn(
            'flex flex-col flex-1 transition-all duration-300',
            !isMobile && (isSidebarOpen ? 'md:ml-64' : 'md:ml-16'),
            'ml-0'
          )}
        >
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </QueryProvider>
  );
}
