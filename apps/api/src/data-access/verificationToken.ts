import { tokenLength, tokenTtl } from "@/common/config/config";
import { generateRandomToken } from "@/common/utils/token";
import { db } from "@/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createVerificationToken = async (userId: string) => {
  const token = await generateRandomToken(tokenLength);
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

export const getVerificationToken = async (token: string) => {
  return await db.query.verificationTokens.findFirst({ where: eq(verificationTokens.token, token) });
};

export const deleteVerificationToken = async (token: string) => {
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));
};
