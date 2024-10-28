import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['member', 'admin']);
export const accountTypeEnum = pgEnum('type', ['email', 'google', 'facebook']);

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  password: text('password'),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  role: varchar('role', { enum: ['user', 'admin'] }).default('user'),
  plan: varchar('plan', { enum: ['free', 'pro'] }).default('free'),
});

export const accounts = pgTable('account', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: accountTypeEnum('accountType').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

export const userSettings = pgTable('userSetting', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  theme: varchar('theme', { enum: ['light', 'dark'] }).default('dark'),
  preferredLang: varchar('preferredLang', { enum: ['vi', 'en'] }).default('vi'),
  isTwoFactorEnabled: boolean('isTwoFactorEnabled').default(false),
});

export const verificationTokens = pgTable('verificationToken', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const refreshTokens = pgTable('refreshToken', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull().unique(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
});

export const resetPasswordTokens = pgTable('resetPasswordToken', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export const twoFactorTokens = pgTable('twoFactorToken', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  email: text('email').notNull(),
});

export const twoFactorConfirmations = pgTable('twoFactorConfirmation', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export type InsertAccount = typeof accounts.$inferInsert;
export type SelectAccount = typeof accounts.$inferSelect;

export type InsertUserSettings = typeof userSettings.$inferInsert;
export type SelectUserSettings = typeof userSettings.$inferSelect;
