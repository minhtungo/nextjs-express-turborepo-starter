import { authFetch } from '@/lib/api';
import { handleApiResponse } from '@/lib/api/utils';
import { env } from '@repo/env/server';
import { ApiResponse } from '@repo/types/api';

interface FetchOptions extends RequestInit {
  body: any;
}

export const api = {
  get: async <T>(path: string, options?: Omit<FetchOptions, 'method'>, isPublic?: boolean): Promise<ApiResponse<T>> => {
    const response = await authFetch(
      `${env.SERVER_BASE_URL}${path}`,
      {
        ...options,
        ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
        method: 'GET',
      },
      isPublic
    );

    return handleApiResponse<T>(response);
  },
  post: async <T>(
    path: string,
    options?: Omit<FetchOptions, 'method'>,
    isPublic?: boolean
  ): Promise<ApiResponse<T>> => {
    const response = await authFetch(
      `${env.SERVER_BASE_URL}${path}`,
      {
        ...options,
        ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers ? options.headers : {}),
        },
        credentials: 'include',
        method: 'POST',
      },
      isPublic
    );

    return handleApiResponse<T>(response);
  },
  put: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ? options.headers : {}),
      },
      method: 'PUT',
    });

    return handleApiResponse<T>(response);
  },
  patch: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ? options.headers : {}),
      },
      method: 'PATCH',
    });

    return handleApiResponse(response);
  },
  delete: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_BASE_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ? options.headers : {}),
      },
      method: 'DELETE',
    });

    return handleApiResponse(response);
  },
};
