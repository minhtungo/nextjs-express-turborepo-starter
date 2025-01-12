import type { Request, Response } from 'express';

import { handleServiceResponse } from '@/common/lib/httpHandlers';
import AuthService from '@/modules/auth/authService';

import { env } from '@/common/lib/env';
import { ServiceResponse } from '@/common/models/serviceResponse';
import type { signUpProps } from '@repo/validation/auth';
import { StatusCodes } from 'http-status-codes';

const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const serviceResponse = await AuthService.signUp({
    name,
    email,
    password,
  } as signUpProps);

  return handleServiceResponse(serviceResponse, res);
};

const signIn = async (req: Request, res: Response) => {
  if (!req.user) {
    return handleServiceResponse(ServiceResponse.failure('Authentication failed', null, StatusCodes.UNAUTHORIZED), res);
  }

  const sessionResult = await AuthService.createSession(req);

  if (!sessionResult.success) {
    return handleServiceResponse(sessionResult, res);
  }

  return handleServiceResponse(ServiceResponse.success('Successfully signed in', null), res);
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const serviceResponse = await AuthService.forgotPassword(email);

  return handleServiceResponse(serviceResponse, res);
};

const resetPassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;

  const serviceResponse = await AuthService.resetPassword(token, password);

  return handleServiceResponse(serviceResponse, res);
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  const serviceResponse = await AuthService.verifyEmail(token);

  return handleServiceResponse(serviceResponse, res);
};

const sendVerificationEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  const serviceResponse = await AuthService.sendVerificationEmail(token);

  return handleServiceResponse(serviceResponse, res);
};

const handleGoogleCallback = async (req: Request, res: Response) => {
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

const signOut = async (req: Request, res: Response) => {
  const result = await AuthService.destroySession(req);
  if (result.success) {
    res.clearCookie(env.SESSION_COOKIE_NAME);
  }
  return handleServiceResponse(result, res);
};

export default {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  handleGoogleCallback,
} as const;
