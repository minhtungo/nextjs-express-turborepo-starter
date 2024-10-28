import type { RequestHandler } from "express";

import { authService } from "@/api/auth/authService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

import { userService } from "@/api/user/userService";
import { env } from "@/common/config/env";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

const signUp: RequestHandler = async (req, res) => {
  const { name, email, password } = req.body;

  const serviceResponse = await authService.signUp({
    name,
    email,
    password,
  });

  return handleServiceResponse(serviceResponse, res);
};

const signIn: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    const serviceResponse = ServiceResponse.failure("User not found", StatusCodes.UNAUTHORIZED);
    return handleServiceResponse(serviceResponse, res);
  }

  const serviceResponse = await authService.signIn(user.id, user.email, user.isTwoFactorEnabled);

  return handleServiceResponse(serviceResponse, res);
};

const forgotPassword: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const serviceResponse = await authService.forgotPassword(email);

  return handleServiceResponse(serviceResponse, res);
};

const resetPassword: RequestHandler = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const serviceResponse = await authService.resetPassword(token, password);

  return handleServiceResponse(serviceResponse, res);
};

const verifyEmail: RequestHandler = async (req, res) => {
  const { token } = req.params;

  const serviceResponse = await authService.verifyEmail(token);

  return handleServiceResponse(serviceResponse, res);
};

const logout: RequestHandler = async (req, res) => {
  const serviceResponse = await authService.logout(req, res);

  return handleServiceResponse(serviceResponse, res);
};

const sendVerificationEmail: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const serviceResponse = await authService.sendVerificationEmail(email);

  return handleServiceResponse(serviceResponse, res);
};

const handleRefreshToken: RequestHandler = async (req, res) => {
  const serviceResponse = await authService.handleRefreshToken(req, res);

  return handleServiceResponse(serviceResponse, res);
};

const handleGoogleCallback: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) {
    const serviceResponse = ServiceResponse.failure("User not found", StatusCodes.UNAUTHORIZED);
    return handleServiceResponse(serviceResponse, res);
  }

  const { accessToken, refreshToken } = userService.generateTokens(user.id);

  const serviceResponse = ServiceResponse.success(
    "Success",
    {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
    },
    StatusCodes.OK,
  );

  res.redirect(
    `${env.SITE_BASE_URL}/api/auth/google/callback?userId=${user.id}&email=${user.email}&accessToken=${accessToken}&refreshToken=${refreshToken}`,
  );
};

export const authController = {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  sendVerificationEmail,
  handleRefreshToken,
  handleGoogleCallback,
};
