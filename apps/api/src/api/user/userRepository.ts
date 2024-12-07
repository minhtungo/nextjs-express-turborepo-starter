import { hashPassword } from '@/common/lib/password';
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
): Promise<SelectUser> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user as SelectUser;
};

type UserColumns = {
  [key in keyof SelectUser]?: boolean;
};

const getUserById = async <T>(id: string, columns?: UserColumns): Promise<SelectUser> => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user as SelectUser;
};

const getUserSettingsByUserId = async (userId: string) => {
  return await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
};

const updateUser = async (userId: string, data: Partial<InsertUser>, trx: typeof db = db) => {
  await trx.update(users).set(data).where(eq(users.id, userId));
};

const updateUserSettings = async ({ userId, data }: { userId: string; data: Partial<InsertUserSettings> }) => {
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
  updateUser,
  updateUserSettings,
  updatePassword,
};
