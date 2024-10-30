import { users } from "@/db/schema";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const verificationTokens = pgTable("verificationToken", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: "date" }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type InsertVerificationToken = typeof verificationTokens.$inferInsert;
export type SelectVerificationToken = typeof verificationTokens.$inferSelect;

export default verificationTokens;
