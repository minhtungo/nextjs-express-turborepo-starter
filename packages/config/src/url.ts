export const url = {
  development: {
    frontend: 'http://localhost:3000',
    backend: 'http://localhost:4000',
    api: 'http://localhost:4000/api',
  },
  production: {
    frontend: 'https://your-domain.com',
    backend: 'https://api.your-domain.com',
    api: 'https://api.your-domain.com/api',
  },
  test: {
    frontend: 'http://localhost:3000',
    backend: 'http://localhost:4000',
    api: 'http://localhost:4000/api',
  },
} as const;
