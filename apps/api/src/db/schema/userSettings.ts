import { users } from "@/db/schema";
import { boolean, pgEnum, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["member", "admin"]);
export const accountTypeEnum = pgEnum("type", ["email", "google", "facebook"]);

const userSettings = pgTable("userSetting", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: varchar({ enum: ["light", "dark"] }).default("dark"),
  isTwoFactorEnabled: boolean().default(false),
});

export type InsertUserSettings = typeof userSettings.$inferInsert;
export type SelectUserSettings = typeof userSettings.$inferSelect;

export default userSettings;
