export const cookie = {
  accessToken: {
    name: 'x-access-token',
    expires: 60 * 60 * 24 * 1000,
  },
  refreshToken: {
    name: 'x-refresh-token',
    expires: 60 * 60 * 24 * 1000 * 7,
  },
};

export const afterLoginUrl = '/';

export const authRoutes = {
  signIn: '/signin',
  signUp: '/signup',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
};
