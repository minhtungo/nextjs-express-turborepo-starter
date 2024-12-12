import type { RequestHandler } from 'express';

import { authService } from '@/api/auth/authService';
import { handleServiceResponse } from '@/common/lib/httpHandlers';

import { env } from '@/common/config/env';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { signUpProps } from '@repo/types';
import { StatusCodes } from 'http-status-codes';
import { config } from '@repo/lib';

const signUp: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

  const serviceResponse = await authService.signUp({
    name,
    email,
    password,
  } as signUpProps);

  return handleServiceResponse(serviceResponse, res);
};

const signIn: RequestHandler = async (req, res) => {
  if (!req.user) {
    return handleServiceResponse(ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED), res);
  }

  req.login(req.user, async (err) => {
    if (err) {
      return handleServiceResponse(
        ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED),
        res
      );
    }

    const serviceResponse = await authService.signIn();

    return handleServiceResponse(serviceResponse, res);
  });
};

const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const serviceResponse = await authService.forgotPassword(email);

  return handleServiceResponse(serviceResponse, res);
};

const resetPassword: RequestHandler = async (req, res) => {
  const { password, token } = req.body;

  const serviceResponse = await authService.resetPassword(token, password);

  return handleServiceResponse(serviceResponse, res);
};

const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.body;

  const serviceResponse = await authService.verifyEmail(token);

  return handleServiceResponse(serviceResponse, res);
};

const sendVerificationEmail: RequestHandler = async (req, res) => {
  const { token } = req.body;

  const serviceResponse = await authService.sendVerificationEmail(token);

  return handleServiceResponse(serviceResponse, res);
};

const handleGoogleCallback: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(`${config.app.url}/sign-in?error=${encodeURIComponent('Authentication failed')}`);
  }

  return res.redirect(`${config.app.url}/dashboard`);
  // const { accessToken } = authService.generateTokens(user.id);

  // res.redirect(
  //   `${env.SITE_BASE_URL}/api/auth/google/callback?userId=${user.id}&email=${user.email}&accessToken=${accessToken}`
  // );
};

const signOut: RequestHandler = async (req, res, next) => {
  // await new Promise((resolve) => {
  //   req.session.destroy((err) => {
  //     if (err) console.error('Session destruction error:', err);
  //     res.clearCookie(session.name);
  //     resolve(true);
  //   });
  // });

  req.logOut(async (err) => {
    if (err) {
      return next(err);
    }

    const serviceResponse = await authService.signOut();

    return handleServiceResponse(serviceResponse, res);
  });
};

const getSession: RequestHandler = async (req, res) => {
  const serviceResponse = await authService.getSession(req.user);

  return handleServiceResponse(serviceResponse, res);
};

export const authController: Record<string, RequestHandler> = {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  handleGoogleCallback,
  getSession,
};
