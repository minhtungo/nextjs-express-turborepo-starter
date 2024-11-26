import { db } from '@repo/database';
import { refreshTokens } from '@repo/database';
import { eq } from 'drizzle-orm';

export const saveRefreshToken = async (userId: string, token: string) => {
  await db.insert(refreshTokens).values({
    userId,
    token,
  });
};

export const updateRefreshToken = async (userId: string, token: string) => {
  return await db
    .insert(refreshTokens)
    .values({
      userId,
      token,
    })
    .onConflictDoUpdate({
      target: refreshTokens.userId,
      set: {
        token,
      },
    });
};

export const getRefreshTokenByToken = async (token: string) => {
  return await db.query.refreshTokens.findFirst({ where: eq(refreshTokens.token, token) });
};

export const getRefreshTokenByUserId = async (userId: string) => {
  return await db.query.refreshTokens.findFirst({ where: eq(refreshTokens.userId, userId) });
};

export const deleteRefreshToken = async (token: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
};

export const deleteAllRefreshTokens = async (userId: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
};
