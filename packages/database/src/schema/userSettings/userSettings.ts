import { boolean, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { users } from "../users";

export const userSettings = pgTable("userSetting", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: varchar({ enum: ["light", "dark"] }).default("dark"),
  isTwoFactorEnabled: boolean().default(false),
});
