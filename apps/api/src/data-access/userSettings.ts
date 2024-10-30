import { db } from "@/db";
import { userSettings } from "@/db/schema";
import type { InsertUserSettings } from "@/db/schema/userSettings";

export const createUserSettings = async ({ userId, ...data }: { userId: string } & Partial<InsertUserSettings>) => {
  await db.insert(userSettings).values({
    userId,
    ...data,
  });
};
