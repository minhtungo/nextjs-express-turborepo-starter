import { authFetch } from '@/lib/api/customFetch';
import { handleApiResponse } from '@/lib/api/utils';
import { config } from '@repo/lib/config';
import { ApiResponse } from '@repo/types';

interface FetchOptions extends RequestInit {
  body: any;
}

const createBaseConfig = (method: string, options?: Omit<FetchOptions, 'method'>) => {
  return {
    ...options,
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    credentials: 'include' as RequestCredentials,
    method,
  };
};

export const api = {
  get: async <T>(path: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`/api${path}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
    });

    return handleApiResponse<T>(response);
  },
  post: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`/api${path}`, {
      ...createBaseConfig('POST', options),
    });

    return handleApiResponse<T>(response);
  },
  put: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`/api${path}`, {
      ...createBaseConfig('PUT', options),
    });

    return handleApiResponse<T>(response);
  },
  patch: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`/api${path}`, {
      ...createBaseConfig('PATCH', options),
    });

    return handleApiResponse(response);
  },
  delete: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`/api${path}`, {
      ...createBaseConfig('DELETE', options),
    });

    return handleApiResponse(response);
  },
};
