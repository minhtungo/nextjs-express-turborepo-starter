import { setSessionTokenCookie } from '@/lib/auth';
import { ApiResponse } from '@repo/types';
import { getClientSessionToken, getSessionToken } from '@/lib/auth';
import { config } from '@repo/lib';

export interface FetchOptions extends RequestInit {
  body: any;
}

const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const setCookieHeader = response.headers.get('Set-Cookie');

    if (setCookieHeader) {
      const cookieValue = setCookieHeader.split(';')[0].split('=').slice(1).join('=');
      setSessionTokenCookie(cookieValue);
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Server error',
      statusCode: 500,
    } as ApiResponse<T>;
  }
};

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

export const authFetch = async (endpoint: string, baseOptions: Partial<FetchOptions>) => {
  const isServer = typeof window === 'undefined';

  const url = new URL(endpoint, isServer ? config.server.url : `${config.app.url}/api`);
  const options = createBaseConfig(baseOptions);

  const sessionCookie = isServer ? await getSessionToken() : getClientSessionToken();

  options.headers = {
    ...options.headers,
    ...(sessionCookie ? { Cookie: `${config.auth.sessionCookie.name}=${sessionCookie}` } : {}),
  };

  const response = await fetch(url, options);

  return response;
};

export const api = {
  get: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method' | 'body'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${endpoint}`, {
      ...options,
      method: 'GET',
    });

    return handleApiResponse<T>(response);
  },
  post: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${endpoint}`, {
      ...options,
      method: 'POST',
    });

    return handleApiResponse<T>(response);
  },
  put: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${endpoint}`, {
      ...options,
      method: 'PUT',
    });

    return handleApiResponse<T>(response);
  },
  patch: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${endpoint}`, {
      ...options,
      method: 'PATCH',
    });

    return handleApiResponse(response);
  },
  delete: async <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>): Promise<ApiResponse<T>> => {
    const response = await authFetch(`${endpoint}`, {
      ...options,
      method: 'DELETE',
    });

    return handleApiResponse(response);
  },
};
