import { getSessionToken } from '@/lib/auth';
import { config } from '@repo/lib';

export const authFetch = async (url: string | URL, options: RequestInit = {}) => {
  const sessionCookie = typeof window === 'undefined' ? await getSessionToken() : null;

  const finalUrl = typeof window === 'undefined' ? `${config.app.url}${url}` : url;

  options.headers = {
    ...options.headers,
    ...(sessionCookie ? { Cookie: `${config.auth.sessionCookie.name}=${sessionCookie}` } : {}),
  };

  const response = await fetch(finalUrl, options);

  return response;
};

// export const authFetch = async (url: string | URL, options: RequestInit = {}, isPublic = false) => {
//   // const accessToken = isPublic ? null : await getAccessToken();

//   options.headers = {
//     ...options.headers,
//     // ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//   };

//   options.credentials = 'include';

//   let response = await fetch(url, options);

//   if (response.status === 401 && !isPublic) {
//     const refreshToken = await getRefreshToken();
//     if (!refreshToken) {
//       await deleteSession();
//       throw new Error('No refresh token found');
//     }
//     console.log('currentRefreshToken', refreshToken);

//     const newAccessToken = await refreshTokenService(refreshToken);
//     console.log('newAccessToken', newAccessToken);

//     if (newAccessToken) {
//       options.headers = {
//         ...options.headers,
//         Authorization: `Bearer ${newAccessToken}`,
//       };
//       response = await fetch(url, options);
//     }
//   }
//   return response;
// };
