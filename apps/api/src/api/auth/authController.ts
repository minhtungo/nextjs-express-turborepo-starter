import type { Request, RequestHandler, Response } from 'express';

import { authService } from '@/api/auth/authService';
import { handleServiceResponse } from '@/common/utils/httpHandlers';

import { cookie } from '@/common/utils/config';
import { StatusCodes } from 'http-status-codes';

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
    const { email, password, code } = req.body;

    const serviceResponse = await authService.login({
      email,
      password,
      code,
    });

    if (serviceResponse.statusCode === StatusCodes.OK) {
      res.cookie(cookie.refreshToken.name, serviceResponse.data?.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + cookie.refreshToken.expires * 2),
      });
    }

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
}

export const authController = new AuthController();
