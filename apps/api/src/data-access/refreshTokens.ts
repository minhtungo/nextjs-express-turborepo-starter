import { db } from "@/db";
import { refreshTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export const getRefreshToken = async (token: string) => {
  return await db.query.refreshTokens.findFirst({ where: eq(refreshTokens.token, token) });
};

export const deleteRefreshToken = async (token: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
};

export const deleteAllRefreshTokens = async (userId: string) => {
  await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
};
