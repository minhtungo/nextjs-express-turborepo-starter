import { tokenLength, tokenTtl } from '@/common/config/config';
import { hashPassword } from '@/common/utils/password';
import { generateToken } from '@/common/utils/token';
import {
  db,
  accounts,
  users,
  resetPasswordTokens,
  type InsertAccount,
  twoFactorConfirmations,
  twoFactorTokens,
  verificationTokens,
} from '@repo/database';
  import { eq } from 'drizzle-orm';

// Reset Password Token operations
export const createResetPasswordToken = async (userId: string) => {
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

export const getResetPasswordTokenByToken = async (token: string) => {
  const existingToken = await db.query.resetPasswordTokens.findFirst({
    where: eq(resetPasswordTokens.token, token),
  });

  return existingToken;
};

export const deleteResetPasswordToken = async (token: string, trx = db) => {
  await trx.delete(resetPasswordTokens).where(eq(resetPasswordTokens.token, token));
};

// Account operations
export const getAccountByUserId = async (userId: string) => {
  const account = await db.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  });

  return account;
};

export const createAccount = async (data: InsertAccount) => {
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

export const updatePassword = async (userId: string, password: string, trx = db) => {
  const hashedPassword = await hashPassword(password);

  await trx.update(users).set({ password: hashedPassword,  }).where(eq(users.id, userId));
};

export const getTwoFactorConfirmation = async (userId: string) => {
  const existingToken = await db.query.twoFactorConfirmations.findFirst({
    where: eq(twoFactorConfirmations.userId, userId),
  });

  return existingToken;
};

export const createTwoFactorConfirmation = async (userId: string, trx = db) => {
  await trx.insert(twoFactorConfirmations).values({
    userId,
  });
};

export const deleteTwoFactorConfirmation = async (id: string) => {
  await db.delete(twoFactorConfirmations).where(eq(twoFactorConfirmations.id, id));
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  return await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });
};

export const deleteTwoFactorToken = async (id: string, trx = db) => {
  await trx.delete(twoFactorTokens).where(eq(twoFactorTokens.id, id));
};

export const createVerificationToken = async (userId: string) => {
  const token = await generateToken(tokenLength);
  const expires = new Date(Date.now() + tokenTtl);
  await db
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

export const getVerificationTokenByToken = async (token: string) => {
  return await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.token, token) });
};

export const getVerificationTokenByUserId = async (userId: string) => {
  return await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.userId, userId) });
};

export const deleteVerificationToken = async (token: string, trx = db) => {
  await trx.delete(verificationTokens).where(eq(verificationTokens.token, token));
};
