import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { authController } from '@/api/auth/authController';

import { env } from '@/common/config/env';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema,
} from '@repo/types/auth';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/sign-in',
  request: {
    body: {
      content: {
        'application/json': {
          schema: signInSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.undefined(), 'Successfully signed in'),
});

authRouter.post(
  '/sign-in',
  validateRequest(z.object({ body: signInSchema })),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {}, (error: any, user: Express.User | false) => {
      if (error || !user) {
        const failureResponse = ServiceResponse.failure('Invalid credentials', null, StatusCodes.UNAUTHORIZED);
        return handleServiceResponse(failureResponse, res);
      }
      // Authentication succeeded
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.signIn
);

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/sign-up',
  request: {
    body: {
      content: {
        'application/json': {
          schema: signUpSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.undefined(), 'Successfully signed up'),
});

authRouter.post('/sign-up', validateRequest(z.object({ body: signUpSchema })), authController.signUp);

authRegistry.registerPath({
  method: 'get',
  tags: ['Auth'],
  path: '/auth/session',
  request: {},
  responses: createApiResponse(z.undefined(), 'Returns the current session'),
});

authRouter.get('/session', authController.getSession);

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/reset-password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), 'Success'),
});

authRouter.post(
  '/reset-password',
  validateRequest(z.object({ body: resetPasswordSchema })),
  authController.resetPassword
);

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/forgot-password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: forgotPasswordSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), 'Success'),
});

authRouter.post(
  '/forgot-password',
  validateRequest(z.object({ body: forgotPasswordSchema })),
  authController.forgotPassword
);

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/verify-email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyEmailSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), 'Success'),
});

authRouter.post('/verify-email', validateRequest(z.object({ body: verifyEmailSchema })), authController.verifyEmail);

authRouter.post('/sign-out', authController.signOut);

authRegistry.registerPath({
  method: 'post',
  tags: ['Auth'],
  path: '/auth/send-verification-email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyEmailSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), 'Success'),
});

authRouter.post('/send-verification-email', validateRequest(verifyEmailSchema), authController.sendVerificationEmail);

authRegistry.registerPath({
  method: 'get',
  tags: ['Auth'],
  path: '/auth/google',
  request: {},
  responses: createApiResponse(z.undefined(), 'Success'),
});

authRouter.get('/google', (req: Request, res: Response, next: NextFunction) => {
  req.session.redirect = req.query.redirect;
  passport.authenticate('google', {
    session: true,
  })(req, res, next);
});

authRouter.get('/google/callback', (req: Request, res: Response, next: NextFunction) => {
  const redirect = req.session.redirect ?? undefined;

  passport.authenticate('google', { session: true }, (error: any, user: Express.User | false) => {
    if (error || !user) {
      return res.redirect(`${env.SITE_BASE_URL}/sign-in?error=${encodeURIComponent('Authentication failed')}`);
    }

    // Log the user in using session
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      delete req.session.redirect;

      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return next(err);
        }
        return res.redirect(`${env.SITE_BASE_URL}/${redirect}`);
      });
    });
  })(req, res, next);
});
