import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "../users/users";

export const verificationTokens = pgTable("verificationToken", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: "date" }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
