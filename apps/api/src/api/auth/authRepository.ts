import { tokenLength, tokenTtl, verificationEmailTtl } from '@/common/config/config';
import { generateSecureToken, generateToken } from '@/common/lib/token';
import {
  accounts,
  db,
  resetPasswordTokens,
  twoFactorConfirmations,
  twoFactorTokens,
  verificationTokens,
  type InsertAccount,
} from '@repo/database';
import { eq } from 'drizzle-orm';

// Reset Password Token operations
const createResetPasswordToken = async (userId: string) => {
  const token = await generateToken(tokenLength);
  const expires = new Date(Date.now() + tokenTtl);

  await db
    .insert(resetPasswordTokens)
    .values({
      userId,
      token,
      expires,
    })
    .onConflictDoUpdate({
      target: resetPasswordTokens.id,
      set: {
        token,
        expires,
      },
    });

  return token;
};

const getResetPasswordTokenByToken = async (token: string) => {
  const existingToken = await db.query.resetPasswordTokens.findFirst({
    where: eq(resetPasswordTokens.token, token),
  });

  return existingToken;
};

const deleteResetPasswordToken = async (token: string, trx: typeof db = db) => {
  await trx.delete(resetPasswordTokens).where(eq(resetPasswordTokens.token, token));
};

// Account operations
const getAccountByUserId = async (userId: string) => {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
};

const createAccount = async (data: InsertAccount) => {
  const [account] = await db
    .insert(accounts)
    .values({
      ...data,
    })
    .returning({
      id: accounts.id,
    });

  return account;
};

const getTwoFactorConfirmation = async (userId: string) => {
  const existingToken = await db.query.twoFactorConfirmations.findFirst({
    where: eq(twoFactorConfirmations.userId, userId),
  });

  return existingToken;
};

const createTwoFactorConfirmation = async (userId: string, trx: typeof db = db) => {
  await trx.insert(twoFactorConfirmations).values({
    userId,
  });
};

const deleteTwoFactorConfirmation = async (id: string) => {
  await db.delete(twoFactorConfirmations).where(eq(twoFactorConfirmations.id, id));
};

const getTwoFactorTokenByEmail = async (email: string) => {
  return await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });
};

const deleteTwoFactorToken = async (id: string, trx: typeof db = db) => {
  await trx.delete(twoFactorTokens).where(eq(twoFactorTokens.id, id));
};

const createVerificationToken = async (userId: string, trx: typeof db = db) => {
  const token = await generateToken(tokenLength);
  const expires = new Date(Date.now() + verificationEmailTtl);

  await trx
    .insert(verificationTokens)
    .values({
      userId,
      token,
      expires,
    })
    .onConflictDoUpdate({
      target: verificationTokens.id,
      set: {
        token,
        expires,
      },
    });
  return token;
};

const getVerificationTokenByToken = async (token: string) => {
  return await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.token, token) });
};

const getVerificationTokenByUserId = async (userId: string) => {
  return await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.userId, userId) });
};

const deleteVerificationToken = async (token: string, trx: typeof db = db) => {
  await trx.delete(verificationTokens).where(eq(verificationTokens.token, token));
};

const createPasswordResetToken = async (userId: string): Promise<string> => {
  const { token, hashedToken } = await generateSecureToken();

  const expires = new Date(Date.now() + tokenTtl);
  await db.insert(resetPasswordTokens).values({
    userId,
    token: hashedToken, // Store the hashed version
    expires,
  });

  return token;
};

const getPasswordResetTokenByToken = async (hashedToken: string) => {
  return await db.query.resetPasswordTokens.findFirst({ where: eq(resetPasswordTokens.token, hashedToken) });
};

export const authRepository = {
  createResetPasswordToken,
  getResetPasswordTokenByToken,
  deleteResetPasswordToken,
  getAccountByUserId,
  createAccount,
  getTwoFactorConfirmation,
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorTokenByEmail,
  deleteTwoFactorToken,
  createVerificationToken,
  getVerificationTokenByToken,
  getVerificationTokenByUserId,
  deleteVerificationToken,
  createPasswordResetToken,
  getPasswordResetTokenByToken,
};
