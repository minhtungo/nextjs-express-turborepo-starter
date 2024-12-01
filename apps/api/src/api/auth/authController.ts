import type { RequestHandler } from 'express';

import { authService } from '@/api/auth/authService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { ServiceResponse } from '@/common/models/serviceResponse';
import { signUpProps } from '@repo/types/auth';
import { StatusCodes } from 'http-status-codes';
import { session } from '@repo/config';
import { env } from '@/common/config/env';

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

  console.log('signIn req.user', req.user);

  // Use req.login instead of manually setting session
  await new Promise<void>((resolve, reject) => {
    req.login(req.user!, (err) => {
      if (err) reject(err);
      resolve();
    });
  });

  const serviceResponse = await authService.signIn();

  return handleServiceResponse(serviceResponse, res);
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
  const { email } = req.body;

  const serviceResponse = await authService.sendVerificationEmail(email);

  return handleServiceResponse(serviceResponse, res);
};

const handleGoogleCallback: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.redirect(`${env.SITE_BASE_URL}/sign-in?error=${encodeURIComponent('Authentication failed')}`);
  }

  return res.redirect(`${env.SITE_BASE_URL}/dashboard`);
  // const { accessToken } = authService.generateTokens(user.id);

  // res.redirect(
  //   `${env.SITE_BASE_URL}/api/auth/google/callback?userId=${user.id}&email=${user.email}&accessToken=${accessToken}`
  // );
};

const signOut: RequestHandler = async (req, res, next) => {
  await new Promise((resolve) => {
    req.session.destroy((err) => {
      if (err) console.error('Session destruction error:', err);
      res.clearCookie(session.name);
      resolve(true);
    });
  });

  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });
  const serviceResponse = await authService.signOut(req.user?.id!);

  return handleServiceResponse(serviceResponse, res);
};

const getSession: RequestHandler = async (req, res) => {
  const serviceResponse = await authService.getSession(req.user);

  return handleServiceResponse(serviceResponse, res);
};

export const authController = {
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
