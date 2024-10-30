import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const twoFactorTokens = pgTable("twoFactorToken", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull(),
  expires: timestamp({ mode: "date" }).notNull(),
  email: text().notNull(),
});

export type InsertTwoFactorToken = typeof twoFactorTokens.$inferInsert;
export type SelectTwoFactorToken = typeof twoFactorTokens.$inferSelect;

export default twoFactorTokens;
