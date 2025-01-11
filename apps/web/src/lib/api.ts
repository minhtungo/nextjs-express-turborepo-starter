import { env } from '@/config/env';
import { buildUrlWithParams } from '@/lib/utils';
import type { ApiResponse } from '@repo/validation/api';

export type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cookie?: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

const getServerCookies = () => {
  if (typeof window !== 'undefined') return '';

  return import('next/headers').then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies();
      return cookieStore
        .getAll()
        .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
        .join('; ');
    } catch (error) {
      return '';
    }
  });
};

const fetchApi = async <T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> => {
  const { method = 'GET', headers = {}, body, cookie, params, cache = 'no-store', next } = options;

  let cookieHeader = cookie;
  if (typeof window === 'undefined' && !cookie) {
    cookieHeader = await getServerCookies();
  }

  const fullUrl = buildUrlWithParams(`${env.NEXT_PUBLIC_EXTERNAL_SERVER_URL}${url}`, params);

  const response = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    cache,
    next,
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || result.statusText || 'An error occurred please try later.');
  }

  return result;
};

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    console.log('body', JSON.stringify(body, null, 2));
    return fetchApi<T>(url, { ...options, method: 'POST', body });
  },
  put<T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'PUT', body });
  },
  patch<T>(url: string, body?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'PATCH', body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
};
