import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getGradeColor(grade: string): string {
  const gradeUpper = grade.toUpperCase();
  if (['A', 'A1', 'B', 'B2'].includes(gradeUpper)) return 'text-green-600 dark:text-green-400';
  if (['C', 'C3', 'C4', 'C5', 'C6'].includes(gradeUpper)) return 'text-yellow-600 dark:text-yellow-400';
  if (['D', 'D7', 'D8'].includes(gradeUpper)) return 'text-orange-600 dark:text-orange-400';
  if (['E', 'F', 'F9'].includes(gradeUpper)) return 'text-red-600 dark:text-red-400';
  return 'text-gray-600 dark:text-gray-400';
}

export function getEligibilityColor(status: string): string {
  switch (status) {
    case 'ELIGIBLE': return 'text-green-600 dark:text-green-400';
    case 'CONDITIONALLY_ELIGIBLE': return 'text-yellow-600 dark:text-yellow-400';
    case 'NOT_ELIGIBLE': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600';
  }
}

export function getEligibilityBadgeColor(status: string): string {
  switch (status) {
    case 'ELIGIBLE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'CONDITIONALLY_ELIGIBLE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'NOT_ELIGIBLE': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800';
  }
}

