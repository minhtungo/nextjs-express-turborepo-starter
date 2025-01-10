import { RequestOptions } from '@/lib/api';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buildUrlWithParams = (url: string, params?: RequestOptions['params']): string => {
  if (!params) return url;
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null)
  );
  if (Object.keys(filteredParams).length === 0) return url;
  const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString();
  return `${url}?${queryString}`;
};
