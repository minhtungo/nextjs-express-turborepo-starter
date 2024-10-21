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

const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    return ApiResponse.failure('Something went wrong', null, response.status);
  }

  const data = await response.json();

  return ApiResponse.success('Success', data, response.status);
};

export const api = {
  get: async (options?: Omit<RequestInit, 'method'>): Promise<ApiResponseType> => {
    const response = await authFetch(env.SERVER_URL, {
      ...options,
      method: 'GET',
    });

    return handleApiResponse(response);
  },
  post: async (options?: Omit<RequestInit, 'method'>): Promise<ApiResponseType> => {
    const response = await authFetch(env.SERVER_URL, {
      ...options,
      method: 'POST',
    });

    return handleApiResponse(response);
  },
  put: async (options?: Omit<RequestInit, 'method'>): Promise<ApiResponseType> => {
    const response = await authFetch(env.SERVER_URL, {
      ...options,
      method: 'PUT',
    });

    return handleApiResponse(response);
  },
  patch: async (options?: Omit<RequestInit, 'method'>): Promise<ApiResponseType> => {
    const response = await authFetch(env.SERVER_URL, {
      ...options,
      method: 'PATCH',
    });

    return handleApiResponse(response);
  },
  delete: async (options?: Omit<RequestInit, 'method'>): Promise<ApiResponseType> => {
    const response = await authFetch(env.SERVER_URL, {
      ...options,
      method: 'DELETE',
    });

    return handleApiResponse(response);
  },
};
