export const cookie = {
  accessToken: {
    name: 'x-access-token',
    maxAge: 60 * 60 * 24,
  },
  refreshToken: {
    name: 'x-refresh-token',
    maxAge: 60 * 60 * 24 * 7,
  },
};

export const afterLoginUrl = '/dashboard';

export const authRoutes = {
  signIn: '/sign-in',
  signUp: '/sign-up',
  forgotPassword: '/forgot-password',
  verifyEmail: '/verify-email',
  resetPassword: '/reset-password',
};

export const apiRoutes = {
  signIn: '/auth/sign-in',
  signUp: '/auth/sign-up',
  forgotPassword: '/auth/forgot-password',
  verifyEmail: '/auth/verify-email',
  resetPassword: '/auth/reset-password',
  sendVerificationEmail: '/auth/send-verification-email',
};
