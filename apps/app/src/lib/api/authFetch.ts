import { customFetch } from '@/lib/api/customFetch';
import { handleApiResponse } from '@/lib/api/utils';
import { env } from '@repo/env/server';
import { ApiResponse } from '@repo/types/api';

interface FetchOptions extends RequestInit {
  body: BodyInit | null | undefined;
}

const createBaseConfig = (method: string, options?: Omit<FetchOptions, 'method'>) => ({
  ...options,
  ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  headers: {
    'Content-Type': 'application/json',
    ...(options?.headers ?? {}),
  },
  credentials: 'include' as RequestCredentials,
  method,
});

export const api = {
  get: async <T>(path: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<ApiResponse<T>> => {
    const response = await customFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
    });

    return handleApiResponse<T>(response);
  },
  post: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await customFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...createBaseConfig('POST', options),
    });

    return handleApiResponse<T>(response);
  },
  put: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await customFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...createBaseConfig('PUT', options),
    });

    return handleApiResponse<T>(response);
  },
  patch: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await customFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...createBaseConfig('PATCH', options),
    });

    return handleApiResponse(response);
  },
  delete: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await customFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...createBaseConfig('DELETE', options),
    });

    return handleApiResponse(response);
  },
};
