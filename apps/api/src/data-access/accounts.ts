import { saltRounds } from '@/common/config/config';
import { db, accounts, users } from '@repo/database';
import type { InsertAccount } from '@repo/database/schema/accounts';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

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
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await trx.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};
