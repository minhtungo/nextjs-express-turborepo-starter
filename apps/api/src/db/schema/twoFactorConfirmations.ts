import { users } from "@/db/schema";

import { pgTable, text } from "drizzle-orm/pg-core";

const twoFactorConfirmations = pgTable("twoFactorConfirmation", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export type InsertTwoFactorConfirmation = typeof twoFactorConfirmations.$inferInsert;
export type SelectTwoFactorConfirmation = typeof twoFactorConfirmations.$inferSelect;

export default twoFactorConfirmations;
