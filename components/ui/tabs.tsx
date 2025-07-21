'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Tabs({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('w-full', className)} {...props} />;
}

export function TabsList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('inline-flex items-center space-x-2 rounded-lg bg-gray-100 p-1', className)}
      {...props}
    />
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export function TabsTrigger({
  className,
  isActive,
  ...props
}: TabsTriggerProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-all',
        isActive ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-black',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-4', className)} {...props} />;
}
