import { tokenLength, tokenTtl } from "@/common/config/config";
import { generateToken } from "@/common/utils/token";
import { db } from "@/db";
import { resetPasswordTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

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
