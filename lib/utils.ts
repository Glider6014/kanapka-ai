import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRegexPattern(str: string) {
  try {
    new RegExp(str);
    return true;
  } catch {
    return false;
  }
}