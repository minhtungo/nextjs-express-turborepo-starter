import type { RequestHandler } from 'express';

import { handleServiceResponse } from '@/common/lib/httpHandlers';
import { authService } from '@/modules/auth/authService';

import { env } from '@/common/lib/env';
import { ServiceResponse } from '@/common/models/serviceResponse';
import type { signUpProps } from '@repo/validation/auth';
import { StatusCodes } from 'http-status-codes';

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

  const sessionResult = await authService.createSession(req.user, req);

  if (!sessionResult.success) {
    return handleServiceResponse(sessionResult, res);
  }

  return handleServiceResponse(ServiceResponse.success('Successfully signed in', null), res);
};

const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const serviceResponse = await authService.forgotPassword(email);

  return handleServiceResponse(serviceResponse, res);
};

const resetPassword: RequestHandler = async (req, res) => {
  const { password, token } = req.body;

  console.log('resetPassword', req.body);

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
    return res.redirect(`${env.APP_ORIGIN}/sign-in?error=${encodeURIComponent('Authentication failed')}`);
  }

  return res.redirect(`${env.APP_ORIGIN}/dashboard`);
  // const { accessToken } = authService.generateTokens(user.id);

  // res.redirect(
  //   `${env.SITE_BASE_URL}/api/auth/google/callback?userId=${user.id}&email=${user.email}&accessToken=${accessToken}`
  // );
};

const signOut: RequestHandler = async (req, res) => {
  const result = await authService.destroySession(req);
  if (result.success) {
    res.clearCookie(env.SESSION_COOKIE_NAME);
  }
  return handleServiceResponse(result, res);
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
};
