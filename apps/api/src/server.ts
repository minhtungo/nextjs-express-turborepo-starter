import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { openAPIRouter } from '@api/api-docs/openAPIRouter';
import { env } from '@api/common/lib/env';
import '@api/common/strategies/google';
import '@api/common/strategies/local';
import errorHandler from '@api/middlewares/errorHandler';

import notFoundHandler from '@api/middlewares/notFoundHandler';
import requestLogger from '@api/middlewares/requestLogger';
import { pool } from '@repo/database';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import passport from 'passport';

import { v4 as uuidv4 } from 'uuid';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { config } from '@api/common/lib/config';
import rateLimiter from '@api/middlewares/rateLimiter';
import { appRouter } from '@api/router';
import * as trpcExpress from '@trpc/server/adapters/express';
import { createContext } from './trpc';

extendZodWithOpenApi(z);

const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.APP_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);
app.use(helmet());
app.use(rateLimiter);

// Database
const pgSession = connectPgSimple(session);
const sessionStore = new pgSession({
  pool,
});

app.use(
  session({
    name: config.sessionCookie.name,
    secret: config.sessionCookie.secret,
    genid: () => {
      return uuidv4();
    },
    resave: false,
    saveUninitialized: false,
    rolling: false,
    store: sessionStore,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  })
);

// app.use(sessionRenewal);

app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use(requestLogger);

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Routes
// app.use('/health-check', healthCheckRouter);
// app.use('/auth', authRouter);
// app.use('/user', assertAuthenticated, userRouter);

// Swagger UI
app.use(openAPIRouter);

// Not found handler
app.use(notFoundHandler);

// Error handlers
app.use(errorHandler());

export { app };
