export const paths = {
  home: {
    getHref: () => '/',
  },
  public: {
    pricing: {
      title: 'Pricing',
      getHref: () => '/pricing',
    },
    contact: {
      title: 'Contact',
      getHref: () => '/contact',
    },
  },
  auth: {
    signIn: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/sign-in${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    signUp: {
      getHref: () => '/sign-up',
    },
    forgotPassword: {
      getHref: () => '/forgot-password',
    },
    verifyEmail: {
      getHref: () => '/verify-email',
    },
    resetPassword: {
      getHref: () => '/reset-password',
    },
  },
  app: {
    root: {
      getHref: () => '/dashboard',
    },
    dashboard: {
      getHref: () => '/dashboard',
    },
    settings: {
      getHref: () => '/settings',
    },
    profile: {
      getHref: () => '/profile',
    },
  },
};

export const protectedRoutes = ['/dashboard', '/dashboard/settings'];

export const apiPaths = {
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    signOut: '/auth/sign-out',
    forgotPassword: '/auth/forgot-password',
    verifyEmail: '/auth/verify-email',
    resetPassword: '/auth/reset-password',
    sendVerificationEmail: '/auth/send-verification-email',
    refreshToken: '/auth/refresh-token',
  },
  user: {
    getCurrentUser: '/user/me',
    updateProfile: '/user/me',
    changePassword: '/user/me/change-password',
  },
};
