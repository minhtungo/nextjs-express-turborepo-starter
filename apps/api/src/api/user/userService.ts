import { StatusCodes } from 'http-status-codes';

import type { User } from '@/api/user/userModel';
import { UserRepository } from '@/api/user/userRepository';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';
import { sign } from 'jsonwebtoken';
import { cookie } from '@/common/utils/config';

export const generateAccessToken = (userId: string) => {
  return sign({ sub: userId }, cookie.accessToken.secret, {
    expiresIn: cookie.accessToken.expiresIn,
    algorithm: cookie.accessToken.algorithm,
  });
};

export const generateRefreshToken = (userId: string) => {
  return sign({ sub: userId }, cookie.refreshToken.secret, {
    expiresIn: cookie.refreshToken.expiresIn,
    algorithm: cookie.refreshToken.algorithm,
  });
};

export const generateTokens = (userId: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
};
