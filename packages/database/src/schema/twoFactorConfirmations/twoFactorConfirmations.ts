import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "../users";

export const twoFactorConfirmations = pgTable("twoFactorConfirmation", {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
