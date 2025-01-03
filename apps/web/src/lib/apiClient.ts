import { FetchOptions } from '@/lib/api';
import { env } from '@/lib/env';
import type { ApiResponse } from '@repo/validation/api';

const API_BASE_URL = env.NEXT_PUBLIC_EXTERNAL_SERVER_URL;

const createBaseConfig = (options?: Partial<FetchOptions>) => {
  return {
    ...options,
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    credentials: 'include' as RequestCredentials,
  };
};

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || 'An error occurred please try later.');
  }

  return data as ApiResponse<T>;
}

const fetcher = async <T>(url: string, options?: Partial<FetchOptions>) => {
  return await fetch(url, createBaseConfig(options));
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },
  post: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await fetcher(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'POST',
    });

    return handleResponse<T>(response);
  },
  put: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await fetcher(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'PUT',
    });

    return handleResponse<T>(response);
  },
  delete: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await fetcher(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'DELETE',
    });

    return handleResponse<T>(response);
  },
};
