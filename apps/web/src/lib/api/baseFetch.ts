import { env } from '@/config/env';
import { authFetch } from '@/lib/api';
import { handleApiResponse } from '@/lib/api/utils';
import { StatusCodes } from 'http-status-codes';

export class ApiResponse<T = null> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, data: T, statusCode: number) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(message: string, data: T, statusCode: number = StatusCodes.OK) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static failure<T>(message: string, data: T, statusCode: number = StatusCodes.BAD_REQUEST) {
    return new ApiResponse(false, message, data, statusCode);
  }
}

interface FetchOptions extends RequestInit {
  body: any;
}

export const api = {
  get: async <T>(path: string, options?: Omit<FetchOptions, 'method'>, isPublic?: boolean): Promise<T> => {
    const response = await authFetch(
      `${env.SERVER_BASE_URL}${path}`,
      {
        ...options,
        ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
        method: 'GET',
      },
      isPublic
    );

    return handleApiResponse(response);
  },
  post: async <T>(path: string, options?: Omit<FetchOptions, 'method'>, isPublic?: boolean): Promise<T> => {
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

    return handleApiResponse(response);
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

    return handleApiResponse(response);
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
