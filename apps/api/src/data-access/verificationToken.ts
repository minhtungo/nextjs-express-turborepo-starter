import { tokenLength, tokenTtl } from '@/common/config/config';
import { generateToken } from '@/common/utils/token';
import { db } from '@repo/database';
import { verificationTokens } from '@repo/database';
import { eq } from 'drizzle-orm';

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
