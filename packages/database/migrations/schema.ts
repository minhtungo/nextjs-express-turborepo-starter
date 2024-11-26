import { pgTable, foreignKey, text, varchar, boolean, timestamp, unique, integer, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['member', 'admin'])
export const type = pgEnum("type", ['email', 'google', 'facebook'])



export const userSetting = pgTable("userSetting", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	theme: varchar().default('dark'),
	isTwoFactorEnabled: boolean().default(false),
},
(table) => {
	return {
		userSettingUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "userSetting_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const twoFactorToken = pgTable("twoFactorToken", {
	id: text().primaryKey().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	email: text().notNull(),
});

export const twoFactorConfirmation = pgTable("twoFactorConfirmation", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
},
(table) => {
	return {
		twoFactorConfirmationUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "twoFactorConfirmation_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const verificationToken = pgTable("verificationToken", {
	id: text().primaryKey().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	userId: text().notNull(),
},
(table) => {
	return {
		verificationTokenUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "verificationToken_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const refreshToken = pgTable("refreshToken", {
	id: text().primaryKey().notNull(),
	token: text().notNull(),
	userId: text().notNull(),
},
(table) => {
	return {
		refreshTokenUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "refreshToken_userId_user_id_fk"
		}).onDelete("cascade"),
		refreshTokenTokenUnique: unique("refreshToken_token_unique").on(table.token),
		refreshTokenUserIdUnique: unique("refreshToken_userId_unique").on(table.userId),
	}
});

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	userId: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
	type: type().notNull(),
},
(table) => {
	return {
		accountUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const resetPasswordToken = pgTable("resetPasswordToken", {
	id: text().primaryKey().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	userId: text().notNull(),
},
(table) => {
	return {
		resetPasswordTokenUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "resetPasswordToken_userId_user_id_fk"
		}).onDelete("cascade"),
	}
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	password: text(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	role: varchar().default('user'),
	plan: varchar().default('free'),
});
