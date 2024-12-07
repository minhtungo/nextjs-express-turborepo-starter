export const email = {
  development: {
    from: 'noreply@localhost',
    replyTo: 'support@localhost',
  },
  production: {
    from: 'noreply@your-domain.com',
    replyTo: 'support@your-domain.com',
  },
  test: {
    from: 'noreply@localhost',
    replyTo: 'support@localhost',
  },
} as const;
