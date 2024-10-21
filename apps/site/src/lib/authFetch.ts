import { getSession } from '@/features/auth/actions/session';

export const authFetch = async (url: string | URL, options: RequestInit = {}) => {
  const session = await getSession();

  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };

  const response = await fetch(url, options);

  if (response.status === 401) {
    if (!session?.refreshToken) {
      throw new Error('No refresh token found');

      //   const newAccessToken = await refreshToken(session.refreshToken);

      //   if (newAccessToken) {
      //     options.headers.Authorization = `Bearer ${newAccessToken}`;
      //     response = await fetch(url, options);
      //   }
    }
  }
  return response;
};
