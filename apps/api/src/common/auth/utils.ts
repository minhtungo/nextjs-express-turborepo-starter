import { jwt, saltRounds } from '@/common/utils/config';
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
  return sign({ sub: id, uid: id, email, provider }, jwt.accessToken.secret, {
    expiresIn: jwt.accessToken.expiresIn,
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
  return sign({ sub: id, uid: id, email, provider }, jwt.refreshToken.secret, {
    expiresIn: jwt.refreshToken.expiresIn,
  });
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (plainTextPassword: string, hashedPassword: string) => {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
