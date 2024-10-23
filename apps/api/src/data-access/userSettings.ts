import { db } from "@/db";
import { type InsertUserSettings, userSettings } from "@/db/schema";

export const createUserSettings = async ({ userId, ...data }: { userId: string } & Partial<InsertUserSettings>) => {
  await db.insert(userSettings).values({
    userId,
    ...data,
  });
};
