# Full Stack Turborepo Starter

A full-stack monorepo starter template built with Turborepo, featuring a Next.js frontend and Express backend.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `nextjs`: a [Next.js](https://nextjs.org/) app
- `react`: a [React](https://react.dev/) app (alternative frontend option)
- `api`: an [Express](https://expressjs.com/) server with tRPC, authentication, and PostgreSQL database

### Packages

- `@repo/ui`: a React component library with [Tailwind CSS](https://tailwindcss.com/)
- `@repo/database`: PostgreSQL database with Drizzle ORM
- `@repo/validation`: shared validation schemas using Zod
- `@repo/email`: email templates using React Email
- `@repo/logger`: shared logger configuration using Pino
- `@repo/eslint-config`: shared ESLint configurations
- `@repo/tsconfig`: shared TypeScript configurations

## Getting Started

### Prerequisites

- Node.js >= 20
- PNPM >= 9.15.3
- PostgreSQL

## Credits

- [Bulletproof React ](https://github.com/alan2207/bulletproof-react): Used for the React frontend boilerplate.

This project integrates portions of this template, which are licensed under their respective open-source licenses. See their repositories for more details.
