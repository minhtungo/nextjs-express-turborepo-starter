import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { env } from '@/common/lib/env';
import '@/common/strategies/google';
import '@/common/strategies/local';
import errorHandler from '@/middlewares/errorHandler';
import { authRouter } from '@/modules/auth/authRouter';
import { healthCheckRouter } from '@/modules/healthCheck/healthCheckRouter';
import { userRouter } from '@/modules/user/userRouter';

import notFoundHandler from '@/middlewares/notFoundHandler';
import requestLogger from '@/middlewares/requestLogger';
import { pool } from '@repo/database';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import passport from 'passport';

import assertAuthenticated from '@/middlewares/assertAuthenticated';

import rateLimiter from '@/middlewares/rateLimiter';
import { v4 as uuidv4 } from 'uuid';

import { config } from '@/common/lib/config';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

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

// Routes
app.use('/health-check', healthCheckRouter);
app.use('/auth', authRouter);
app.use('/user', assertAuthenticated, userRouter);

// Swagger UI
app.use(openAPIRouter);

// Not found handler
app.use(notFoundHandler);

// Error handlers
app.use(errorHandler());

export { app };
