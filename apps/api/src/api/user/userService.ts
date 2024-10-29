import { cookie } from "@/common/config/config";
import { sign } from "jsonwebtoken";

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

export const userService = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};
