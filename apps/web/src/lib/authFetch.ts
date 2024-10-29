import { getSession } from '@/features/auth/actions/session';
import { refreshTokenService } from '@/features/auth/lib/services';

export const authFetch = async (url: string | URL, options: RequestInit = {}, isPublic = false) => {
  const session = isPublic ? null : await getSession();

  options.headers = {
    ...options.headers,
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
  };

  let response = await fetch(url, options);

  if (response.status === 401 && !isPublic) {
    if (!session?.refreshToken) {
      throw new Error('No refresh token found');
    }

    const newAccessToken = await refreshTokenService(session.refreshToken);

    if (newAccessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      response = await fetch(url, options);
    }
  }
  return response;
};
