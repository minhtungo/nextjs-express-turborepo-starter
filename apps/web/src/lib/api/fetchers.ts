export const authFetch = async (url: string | URL, options: RequestInit = {}, isPublic = false) => {
  options.credentials = 'include';

  options.headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, options);

  if (response.status === 401 && !isPublic) {
    throw new Error('Session expired');
  }

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
