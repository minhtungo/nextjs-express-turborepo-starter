import { setSessionTokenCookie } from '@/lib/auth';
import { ApiResponse } from '@repo/types/api';

export const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
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
