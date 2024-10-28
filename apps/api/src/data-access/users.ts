import { authService } from "@/api/auth/authService";
import { db } from "@/db";
import { type InsertUser, type InsertUserSettings, type SelectUser, userSettings, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const createUser = async (data: InsertUser) => {
  const { password: plainPassword, ...rest } = data;

  const password = plainPassword ? await authService.hashPassword(plainPassword) : undefined;

  // Using a transaction to ensure both operations succeed or fail together
  return await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ ...rest, password })
      .returning({
        id: users.id,
        email: users.email,
      });

    // Create default user settings
    await tx.insert(userSettings).values({
      userId: user.id,
      // Add any default settings here
    });

    return user;
  });
};

export const getUserByEmail = async (email: string, columns?: UserColumns) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns,
  });

  return user;
};

type UserColumns = {
  [key in keyof SelectUser]?: boolean;
};

export const getUserById = async <T>(id: string, columns?: UserColumns): Promise<T> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns,
  });

  return user as T;
};

export const getUserSettingsByUserId = async (userId: string) => {
  return await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
};

export const updateUserEmailVerification = async (userId: string) => {
  await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, userId));
};

export const updateProfile = async ({ userId, data }: { userId: string; data: Partial<InsertUser> }) => {
  console.log("data", data);
  await db.update(users).set(data).where(eq(users.id, userId));
};

export const updateSettings = async ({ userId, data }: { userId: string; data: Partial<InsertUserSettings> }) => {
  await db.update(userSettings).set(data).where(eq(userSettings.userId, userId));
};

export const updatePassword = async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
  const hashedPassword = await authService.hashPassword(newPassword);

  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};
