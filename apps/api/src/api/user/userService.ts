import bcrypt from 'bcryptjs';
import { cookie, saltRounds } from '@/common/config/config';
import { sign } from 'jsonwebtoken';

const generateAccessToken = (userId: string) => {
  return sign({ sub: userId }, cookie.accessToken.secret, {
    expiresIn: cookie.accessToken.expiresIn,
    algorithm: cookie.accessToken.algorithm,
  });
};

const generateRefreshToken = (userId: string) => {
  return sign({ sub: userId }, cookie.refreshToken.secret, {
    expiresIn: cookie.refreshToken.expiresIn,
    algorithm: cookie.refreshToken.algorithm,
  });
};

const generateTokens = (userId: string) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
};

const hashRefreshToken = async (refreshToken: string) => {
  return await bcrypt.hash(refreshToken, saltRounds);
};

const verifyRefreshToken = async (plainRefreshToken: string, hashedRefreshToken: string) => {
  return await bcrypt.compare(plainRefreshToken, hashedRefreshToken);
};

export const userService = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  hashRefreshToken,
  verifyRefreshToken,
};
