import { deleteSession, getAccessToken, getRefreshToken, getSession } from '@/features/auth/actions/session';
import { refreshTokenService } from '@/features/auth/lib/services';

export const authFetch = async (url: string | URL, options: RequestInit = {}, isPublic = false) => {
  const accessToken = isPublic ? null : await getAccessToken();

  options.headers = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  options.credentials = 'include';

  let response = await fetch(url, options);

  if (response.status === 401 && !isPublic) {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      await deleteSession();
      throw new Error('No refresh token found');
    }

    const newAccessToken = await refreshTokenService(refreshToken);

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
