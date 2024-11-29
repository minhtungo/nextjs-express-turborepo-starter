import { db, twoFactorConfirmations } from '@repo/database';
import { eq } from 'drizzle-orm';

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
