import { tokenLength, tokenTtl } from "@/config";
import { db } from "@/db";
import { resetPasswordTokens } from "@/db/schema";
import { generateRandomToken } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const createResetPasswordToken = async (userId: string) => {
  const token = await generateRandomToken(tokenLength);
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

export const getResetPasswordToken = async (token: string) => {
  const existingToken = await db.query.resetPasswordTokens.findFirst({
    where: eq(resetPasswordTokens.token, token),
  });

  return existingToken;
};

export const deleteResetPasswordToken = async (token: string, trx = db) => {
  await trx.delete(resetPasswordTokens).where(eq(resetPasswordTokens.token, token));
};
