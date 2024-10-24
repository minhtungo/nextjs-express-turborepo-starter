import { cookie, saltRounds } from '@/common/utils/config';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export const createAccessToken = ({
  id,
  email,
  provider = 'email',
}: {
  id: string;
  email: string;
  provider?: 'google' | 'email';
}) => {
  return sign({ sub: id, uid: id, email, provider }, cookie.accessToken.secret, {
    expiresIn: cookie.accessToken.expiresIn,
    algorithm: cookie.accessToken.algorithm,
  });
};

export const createRefreshToken = ({
  id,
  email,
  provider = 'email',
}: {
  id?: string;
  email?: string;
  provider?: string;
}) => {
  return sign({ sub: id, uid: id, email, provider }, cookie.refreshToken.secret, {
    expiresIn: cookie.refreshToken.expiresIn,
    algorithm: cookie.refreshToken.algorithm,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
