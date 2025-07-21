import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combines clsx and tailwind-merge to handle conditional + conflict-free class names
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs));
}
