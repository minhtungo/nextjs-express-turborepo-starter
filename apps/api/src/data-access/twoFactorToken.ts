import { db } from "@/db";
import { twoFactorTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByEmail = async (email: string) => {
  return await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });
};

export const deleteTwoFactorToken = async (id: string, trx = db) => {
  await trx.delete(twoFactorTokens).where(eq(twoFactorTokens.id, id));
};
