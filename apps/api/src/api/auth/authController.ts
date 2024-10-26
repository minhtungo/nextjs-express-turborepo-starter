import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/authService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

import { generateTokens } from "@/api/user/userService";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

class AuthController {
  public signUp: RequestHandler = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const serviceResponse = await authService.signUp({
      name,
      email,
      password,
    });

    return handleServiceResponse(serviceResponse, res);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    const user = req.user;

    const { accessToken, refreshToken } = generateTokens(user?.id);

    const serviceResponse = ServiceResponse.success("Login successful", { accessToken, refreshToken }, StatusCodes.OK);

    return handleServiceResponse(serviceResponse, res);
  };

  public forgotPassword: RequestHandler = async (req: Request, res: Response) => {
    const { email } = req.body;

    const serviceResponse = await authService.forgotPassword(email);

    return handleServiceResponse(serviceResponse, res);
  };

  public resetPassword: RequestHandler = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { token } = req.params;

    const serviceResponse = await authService.resetPassword(token, password);

    return handleServiceResponse(serviceResponse, res);
  };

  public verifyEmail: RequestHandler = async (req: Request, res: Response) => {
    const { token } = req.params;

    const serviceResponse = await authService.verifyEmail(token);

    return handleServiceResponse(serviceResponse, res);
  };

  public logout: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.logout(req, res);

    return handleServiceResponse(serviceResponse, res);
  };

  public sendVerificationEmail: RequestHandler = async (req: Request, res: Response) => {
    const { email } = req.body;

    const serviceResponse = await authService.sendVerificationEmail(email);

    return handleServiceResponse(serviceResponse, res);
  };

  public handleRefreshToken: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await authService.handleRefreshToken(req, res);

    return handleServiceResponse(serviceResponse, res);
  };

  public handleGoogleCallback: RequestHandler = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = generateTokens(req?.user?.id);

    const response = {
      accessToken,
      refreshToken,
      id: req?.user?.id,
      email: req?.user?.email,
    };

    const serviceResponse = ServiceResponse.success<typeof response>("Success", response, StatusCodes.OK);

    return handleServiceResponse(serviceResponse, res);
  };
}

export const authController = new AuthController();
