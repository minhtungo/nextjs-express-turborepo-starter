import { env } from '@/config/env';
import { authFetch } from '@/lib/authFetch';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';

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

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.any().optional(),
  statusCode: z.number(),
});

export type ApiResponseType = z.infer<typeof ApiResponseSchema>;

const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    return ApiResponse.failure('Something went wrong', null as T, response.status);
  }

  const data = await response.json();

  return ApiResponse.success('Success', data as T, response.status);
};

interface FetchOptions extends RequestInit {
  body: any;
}

export const api = {
  get: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      method: 'GET',
    });

    return handleApiResponse(response);
  },
  post: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      method: 'POST',
    });

    return handleApiResponse(response);
  },
  put: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      method: 'PUT',
    });

    return handleApiResponse(response);
  },
  patch: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      method: 'PATCH',
    });

    return handleApiResponse(response);
  },
  delete: async <T>(path: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${env.SERVER_URL}${path}`, {
      ...options,
      ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
      method: 'DELETE',
    });

    return handleApiResponse(response);
  },
};
