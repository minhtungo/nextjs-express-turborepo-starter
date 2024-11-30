import { ApiResponse } from '@repo/types/api';
import { cookies } from 'next/headers';

export const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const setCookieHeader = response.headers.get('Set-Cookie');
    if (setCookieHeader) {
      const cookieStore = await cookies();
      const [cookieName, ...rest] = setCookieHeader.split('=');
      const fullValue = rest.join('=');
      const cookieValue = fullValue.split(';')[0];

      const attributes = fullValue
        .split(';')
        .slice(1)
        .reduce(
          (acc, attr) => {
            const [key, value] = attr.trim().split('=');
            acc[key.toLowerCase()] = value || true;
            return acc;
          },
          {} as Record<string, any>
        );

      cookieStore.set(cookieName, cookieValue, {
        httpOnly: true,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: attributes.samesite,
        secure: attributes.secure === 'true',
      });
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Server error',
      statusCode: 123,
    } as ApiResponse<T>;
  }
};
