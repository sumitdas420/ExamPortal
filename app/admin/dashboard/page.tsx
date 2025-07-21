'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/Topbar';
import { Button } from '@/components/ui/button';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import AdminTools from '@/components/AdminTools';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // set initial width

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Open sidebar only on desktop by default, closed otherwise
  useEffect(() => {
    if (windowWidth >= 768) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  }, [windowWidth]);

  const isMobile = windowWidth < 768;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden relative">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />

      {/* Backdrop for sidebar overlay on mobile */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div
        className={cn(
          'flex flex-col flex-1 transition-all duration-300',
          // Add margin on desktop only based on sidebar open state
          isSidebarOpen && !isMobile ? 'md:ml-64' : 'md:ml-16',
          // No margin on mobile, to use full width
          'ml-0'
        )}
      >
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Don't force grid here — let content handle itself */}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Dashboard Overview
            </h1>

            <div className="mt-4 sm:mt-0">
              <Button variant="primary" className="px-6 py-3 text-lg font-semibold">
                Create Test
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Your content components rendered normally, no forced grid */}
            <AnalyticsPanel />
            <AdminTools />
            {/* Additional dashboard content sections */}
          </div>
        </main>
      </div>
    </div>
  );
}
