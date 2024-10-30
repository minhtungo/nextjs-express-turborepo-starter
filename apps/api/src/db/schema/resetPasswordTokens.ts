import { users } from "@/db/schema";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const resetPasswordTokens = pgTable("resetPasswordToken", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: "date" }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type InsertResetPasswordToken = typeof resetPasswordTokens.$inferInsert;
export type SelectResetPasswordToken = typeof resetPasswordTokens.$inferSelect;

export default resetPasswordTokens;
