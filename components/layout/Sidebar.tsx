'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BarChart3,
  BookOpenCheck,
  Users,
  ShieldCheck,
  BadgePercent,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
};

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard/home' },
  { title: 'Analytics', icon: BarChart3, href: '/admin/dashboard/analytics' },
  { title: 'Exam Management', icon: BookOpenCheck, href: '/admin/dashboard/exam-management' },
  { title: 'Students', icon: Users, href: '/admin/dashboard/students' },
  { title: 'Admin Controls', icon: ShieldCheck, href: '/admin/dashboard/admin-controls' },
  { title: 'Enrollments', icon: BadgePercent, href: '/admin/dashboard/enrollments' },
  { title: 'Settings', icon: Settings, href: '/admin/dashboard/settings' }
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile }: SidebarProps) {
  const pathname = usePathname();

  const onLogout = () => {
    alert('Logout clicked');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Mobile Toggle Button (top-left, floating) */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          className="fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-full shadow-lg text-white hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 transition"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out overflow-hidden',
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : '',
          isOpen ? 'w-64' : 'w-16',
          'flex-shrink-0'
        )}
        style={{ minWidth: isOpen ? 256 : 64 }}
      >

        {/* Desktop Floating Toggle Button (overlaps sidebar edge) */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className={cn(
              "absolute z-50 left-full top-[64px] -translate-x-1/2 shadow-lg rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 w-11 h-11 flex items-center justify-center transition-all duration-200 group",
              "hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            )}
            style={{ boxShadow: "0 1px 8px 1px rgba(0,0,0,0.10)" }}
          >
            <span className="sr-only">{isOpen ? "Collapse sidebar" : "Expand sidebar"}</span>
            <span className="transition-transform duration-200">
              {isOpen ? (
                // Chevron Left (collapse)
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.25 19.25 8.75 12l6.5-7.25"/>
                </svg>
              ) : (
                // Hamburger (expand)
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                </svg>
              )}
            </span>
          </button>
        )}

        <div className="p-4 relative flex flex-col flex-grow">
          {/* Branding */}
          {isOpen ? (
            <div className="mb-6 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg select-none">EP</div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white select-none">ExamPortal</span>
            </div>
          ) : (
            <div className="mb-6 flex justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg select-none">EP</div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-2 flex-1 overflow-y-auto">
            {navItems.map(({ title, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={title}
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
                    isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300',
                    !isOpen && 'justify-center'
                  )}
                  tabIndex={isOpen ? 0 : -1}
                  title={!isOpen ? title : undefined}
                >
                  <Icon aria-hidden="true" className={cn('flex-shrink-0 transition-all duration-300', isOpen ? 'w-5 h-5' : 'w-7 h-7')} />
                  {isOpen && <span>{title}</span>}
                </Link>
              );
            })}

            {/* Logout styled like nav item */}
            <button
              type="button"
              onClick={onLogout}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md font-semibold transition-colors text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 whitespace-nowrap w-full',
                !isOpen && 'justify-center'
              )}
              title={!isOpen ? 'Logout' : undefined}
              tabIndex={isOpen ? 0 : -1}
            >
              <LogOut aria-hidden="true" className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-7 h-7')} />
              {isOpen && <span>Logout</span>}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
