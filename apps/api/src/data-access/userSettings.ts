import { db } from '@repo/database';
import { userSettings } from '@repo/database/schema';
import type { InsertUserSettings } from '@repo/database/schema/userSettings';

export const createUserSettings = async ({ userId, ...data }: { userId: string } & Partial<InsertUserSettings>) => {
  await db.insert(userSettings).values({
    userId,
    ...data,
  });
};
