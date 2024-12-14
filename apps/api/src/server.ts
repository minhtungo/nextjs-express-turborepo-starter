import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';
import { pino } from 'pino';

import { openAPIRouter } from '@/api-docs/openAPIRouter';
import { authRouter } from '@/api/auth/authRouter';
import '@/api/auth/strategies/google';
import '@/api/auth/strategies/local';
import { healthCheckRouter } from '@/api/healthCheck/healthCheckRouter';
import { userRouter } from '@/api/user/userRouter';
import { env } from '@/common/config/env';
import errorHandler from '@/middleware/errorHandler';

import notFoundHandler from '@/middleware/notFoundHandler';
import requestLogger from '@/middleware/requestLogger';
import { pool } from '@repo/database';
import connectPgSimple from 'connect-pg-simple';
import session from 'express-session';
import passport from 'passport';
import { v4 as uuidv4 } from 'uuid';

import assertAuthenticated from '@/middleware/assertAuthenticated';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import sessionRenewal from '@/middleware/sessionRenewal';
import { config } from '@repo/lib/config';
import rateLimiter from '@/middleware/rateLimiter';
import { kMaxLength } from 'node:buffer';

extendZodWithOpenApi(z);

const logger = pino({ name: 'server start' });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set('trust proxy', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: env.CORS_ORIGIN,
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
    name: config.auth.sessionCookie.name,
    secret: env.SESSION_SECRET,
    genid: () => {
      return uuidv4();
    },
    resave: false,
    saveUninitialized: false,
    rolling: false,
    store: sessionStore,
    cookie: {
      maxAge: config.auth.sessionCookie.maxAge,
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

export { app, logger };
