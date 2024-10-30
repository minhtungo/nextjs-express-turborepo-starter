import { users } from "@/db/schema";
import { pgTable, text } from "drizzle-orm/pg-core";

const refreshTokens = pgTable("refreshToken", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  token: text().notNull().unique(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
});

export type InsertRefreshToken = typeof refreshTokens.$inferInsert;
export type SelectRefreshToken = typeof refreshTokens.$inferSelect;

export default refreshTokens;
