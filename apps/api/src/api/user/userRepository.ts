import { hashPassword } from '@/common/utils/password';
import { type InsertUser, type InsertUserSettings, type SelectUser, db, userSettings, users } from '@repo/database';
import { eq } from 'drizzle-orm';

 const createUser = async (data: InsertUser) => {
  const { password: plainPassword, ...rest } = data;

  const password = plainPassword ? await hashPassword(plainPassword) : undefined;

  const user = await db
    .insert(users)
    .values({ ...rest, password })
    .returning({
      id: users.id,
      email: users.email,
    });

  return user[0];

  // Using a transaction to ensure both operations succeed or fail together
  // return await db.transaction(async (tx) => {
  //   const [user] = await tx
  //     .insert(users)
  //     .values({ ...rest, password })
  //     .returning({
  //       id: users.id,
  //       email: users.email,
  //     });

  //   // Create default user settings
  //   await tx.insert(userSettings).values({
  //     userId: user.id,
  //     // Add any default settings here
  //   });

  //   return user;
  // });
};

 const createUserSettings = async (data: InsertUserSettings) => {
  await db.insert(userSettings).values(data);
};

 const getUserByEmail = async <TColumns extends Partial<Record<keyof SelectUser, true>>>(
  email: string,
  columns?: TColumns
) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns,
  });

  return user as Partial<SelectUser>;
};

type UserColumns = {
  [key in keyof SelectUser]?: boolean;
};

 const getUserById = async <T>(id: string, columns?: UserColumns): Promise<T | SelectUser> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns,
  });

  return user as T | SelectUser;
};

 const getUserSettingsByUserId = async (userId: string) => {
  return await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
};

 const updateUserEmailVerification = async (userId: string, trx: typeof db = db) => {
  await trx.update(users).set({ emailVerified: new Date() }).where(eq(users.id, userId));
};

 const updateProfile = async ({ userId, data }: { userId: string; data: Partial<InsertUser> }) => {
  console.log('data', data);
  await db.update(users).set(data).where(eq(users.id, userId));
};

 const updateSettings = async ({ userId, data }: { userId: string; data: Partial<InsertUserSettings> }) => {
  await db.update(userSettings).set(data).where(eq(userSettings.userId, userId));
};

 const updatePassword = async ({
  userId,
  newPassword,
  trx = db,
}: {
  userId: string;
  newPassword: string;
  trx?: typeof db;
}) => {
  const hashedPassword = await hashPassword(newPassword);

  await trx.update(users).set({ password: hashedPassword }).where(eq(users.id, userId));
};

export const userRepository = {
  createUser,
  createUserSettings,
  getUserByEmail,
  getUserById,
  getUserSettingsByUserId,
  updateUserEmailVerification,
  updateProfile,
  updateSettings,
  updatePassword,
};

