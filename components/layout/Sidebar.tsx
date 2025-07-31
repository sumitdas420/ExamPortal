'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, BarChart3, BookOpenCheck, Users, ShieldCheck,
  BadgePercent, Settings, LogOut, ChevronLeft, ChevronRight, Plus, Sun, Moon, Menu
} from 'lucide-react';
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
};

const navItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { title: 'Analytics', icon: BarChart3, href: '/admin/dashboard/analytics' },
  { title: 'Exam Management', icon: BookOpenCheck, href: '/admin/dashboard/exam-management' },
  { title: 'Students', icon: Users, href: '/admin/dashboard/students' },
  { title: 'Admin Controls', icon: ShieldCheck, href: '/admin/dashboard/admin-controls' },
  { title: 'Enrollments', icon: BadgePercent, href: '/admin/dashboard/enrollments' },
  { title: 'Settings', icon: Settings, href: '/admin/dashboard/settings' },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const ChevronIcon = isOpen ? ChevronLeft : ChevronRight;
  const onLogout = () => router.push('/admin/login');
  const settingsIdx = navItems.findIndex(n => n.title === "Settings");

  return (
    <>
      {/* Hamburger for mobile/tablet when sidebar closed */}
      {isMobile && !isOpen && (
        <button
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          className="fixed top-4 left-4 z-50 bg-blue-600 p-2 rounded-full shadow-lg text-white hover:bg-blue-700 focus:outline-none focus:ring"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-screen bg-background border-r border-gray-200 dark:border-gray-700 shadow z-40 flex flex-col justify-between transition-all duration-300',
          isMobile
            ? isOpen
              ? 'translate-x-0'
              : '-translate-x-full'
            : '',
          isOpen ? 'w-64' : 'w-16',
          'overflow-hidden'
        )}
        style={{ minWidth: isOpen ? 256 : 64, width: isOpen ? 256 : 64, zIndex: 1050 }}
      >
        {/* Header and sidebar toggle */}
        <div className="relative flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-4 h-16">
          <div className="flex items-center ml-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg select-none">EP</div>
            {isOpen && (
              <span className="ml-3 text-lg font-semibold text-foreground whitespace-nowrap">
                ExamPortal
              </span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="rounded-full bg-background border border-gray-300 dark:border-gray-600 shadow p-1 w-8 h-8 flex items-center justify-center focus:outline-none hover:bg-blue-50 transition absolute right-3 top-1/2 -translate-y-1/2 z-10"
            tabIndex={0}
            type="button"
          >
            <ChevronIcon className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Create Test CTA */}
        <div className={cn('mt-3 px-4', !isOpen && 'flex justify-center')}>
          <button
            onClick={() => router.push('/admin/dashboard/exam-management/create')}
            className={cn(
              'flex items-center justify-center w-full rounded-md bg-indigo-600 text-white px-3 py-2 text-xs font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400',
              !isOpen && 'w-10 h-10 p-0'
            )}
            title="Create Test"
            aria-label="Create Test"
            type="button"
          >
            <Plus className="h-4 w-4" />
            {isOpen && <span className="ml-2">Create Test</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col flex-grow overflow-y-auto mt-2 space-y-1 py-2">
          {navItems.slice(0, settingsIdx + 1).map(({ title, icon: Icon, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={title}
                href={href}
                className={cn(
                  'flex items-center px-4 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-colors select-none',
                  isActive
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800',
                  !isOpen && 'justify-center relative'
                )}
                tabIndex={isOpen ? 0 : -1}
                title={!isOpen ? title : undefined}
              >
                <Icon className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-6 h-6')} aria-hidden="true" />
                {isOpen && <span className="ml-3">{title}</span>}
              </Link>
            );
          })}

          {/* Theme toggle nav item below "Settings" */}
          <button
            onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={cn(
              'flex items-center px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap w-full select-none mt-1',
              'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800',
              !isOpen && 'justify-center relative'
            )}
            tabIndex={isOpen ? 0 : -1}
            disabled={!mounted}
            title="Switch theme"
            type="button"
          >
            {mounted
              ? (resolvedTheme === 'dark'
                  ? <Sun className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-6 h-6')} />
                  : <Moon className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-6 h-6')} />)
              : <Sun className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-6 h-6', 'opacity-0')} />
            }
            {isOpen && mounted && (
              <span className="ml-3">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>
        </nav>

        {/* Logout at bottom */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className={cn(
              'flex items-center w-full gap-3 rounded-md px-4 py-3 text-xs font-semibold text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 focus:outline-none focus:ring focus:ring-red-300',
              !isOpen && 'justify-center'
            )}
            title={!isOpen ? 'Logout' : undefined}
            tabIndex={isOpen ? 0 : -1}
            type="button"
          >
            <LogOut className={cn('flex-shrink-0', isOpen ? 'w-5 h-5' : 'w-6 h-6')} aria-hidden="true" />
            {isOpen && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}
