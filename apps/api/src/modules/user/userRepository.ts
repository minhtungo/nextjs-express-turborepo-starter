import { db } from '@repo/database';
import { hashPassword } from '@api/common/lib/password';
import { eq } from '@repo/database/orm';
import { InsertUser, users } from '@repo/database/schema/users';
import { InsertUserSetting, userSettings } from '@repo/database/schema/userSettings';

const createUser = async (data: InsertUser, trx: typeof db = db) => {
  const { password: plainPassword, ...rest } = data;

  const password = plainPassword ? await hashPassword(plainPassword) : undefined;

  const [user] = await trx
    .insert(users)
    .values({ ...rest, password })
    .returning({
      id: users.id,
    });

  if (!user) {
    throw new Error('User not created');
  }

  // Create default user settings
  await trx.insert(userSettings).values({
    userId: user.id,
    // Add any default settings here
  });

  return user;
};

const createUserSettings = async (data: InsertUserSetting, trx: typeof db = db) => {
  await trx.insert(userSettings).values(data);
};

const getUserByEmail = async (email: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
};

const getUserById = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
};

const getUserSettingsByUserId = async (userId: string) => {
  return await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, userId),
  });
};

const updateUser = async (userId: string, data: Partial<InsertUser>, trx: typeof db = db) => {
  const user = await trx.update(users).set(data).where(eq(users.id, userId)).returning({
    id: users.id,
    name: users.name,
  });

  return user[0];
};

const updateUserSettings = async ({ userId, data }: { userId: string; data: Partial<InsertUserSetting> }) => {
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

export default {
  createUser,
  createUserSettings,
  getUserByEmail,
  getUserById,
  getUserSettingsByUserId,
  updateUser,
  updateUserSettings,
  updatePassword,
} as const;
