export const session = {
  name: 'session',
  maxAge: 1000 * 60 * 60 * 24 * 7,
  renewThreshold: 1000 * 60 * 60 * 24 * 3,
};

export const auth = {
  accessTokenExpiresIn: '15m',
  refreshTokenExpiresIn: '7d',
  verificationTokenExpiresIn: '24h',
  passwordResetTokenExpiresIn: '1h',
} as const;
