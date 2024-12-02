import { hash, verify } from 'argon2';

const hashPassword = async (password: string) => {
  return await hash(password);
};

const verifyPassword = async (plainTextPassword: string, hashedPassword: string) => {
  return await verify(hashedPassword, plainTextPassword);
};

export { verifyPassword, hashPassword };
