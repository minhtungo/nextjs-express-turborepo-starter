import { tokenTtl } from "@/config";
import { db } from "@/db";
import { twoFactorTokens } from "@/db/schema";
import { generateRandomToken } from "@/lib/utils";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByEmail = async (email: string) => {
  const twoFactorToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });

  return twoFactorToken;
};

export const createTwoFactorToken = async (email: string) => {
  const token = await generateRandomToken();

  const expires = new Date(Date.now() + tokenTtl);

  await db.insert(twoFactorTokens).values({
    email,
    token,
    expires,
  });
};

export const deleteTwoFactorToken = async (id: string) => {
  await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, id));
};
