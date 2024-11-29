import { ApiResponse } from '@/lib/api/baseFetch';
import { cookies } from 'next/headers';

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
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

      console.log('attributes', attributes);

      cookieStore.set(cookieName, cookieValue, {
        httpOnly: true,
        path: attributes.path || '/',
        expires: attributes.expires ? new Date(attributes.expires) : undefined,
        sameSite: (attributes.samesite || 'lax').toLowerCase() as 'lax' | 'strict' | 'none',
        secure: attributes.secure === 'true',
      });
    }

    const result = await response.json();
    return result;
  } catch (error) {
    return ApiResponse.failure('Server error', null, response.status) as T;
  }
};
