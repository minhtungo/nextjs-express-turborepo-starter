import { hashPassword } from '@/common/auth/utils';
import { db } from '@/db';
import { type InsertUser, type InsertUserSettings, SelectUser, userSettings, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const createUser = async (data: InsertUser) => {
  const { password: plainPassword, ...rest } = data;

  const password = plainPassword ? await hashPassword(plainPassword) : undefined;

  const [user] = await db
    .insert(users)
    .values({ ...rest, ...(password ? { password } : {}) })
    .returning({
      id: users.id,
    });

  return user;
};

export const getUserByEmail = async (email?: string) => {
  if (!email) return;
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
};

type UserColumns = {
  [key in keyof SelectUser]?: boolean;
};

export const getUserById = async (id: string, columns?: UserColumns) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns,
  });

  return user;
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
  console.log('data', data);
  await db.update(users).set(data).where(eq(users.id, userId));
};

export const updateSettings = async ({ userId, data }: { userId: string; data: Partial<InsertUserSettings> }) => {
  await db.update(userSettings).set(data).where(eq(userSettings.userId, userId));
};

export const updatePassword = async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
  const hashedPassword = await hashPassword(newPassword);

  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};
