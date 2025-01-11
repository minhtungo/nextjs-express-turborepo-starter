import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { accountTypeSchema } from '../constants';
import { users } from '../users';

export const accounts = pgTable('accounts', {
  id: text()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: accountTypeSchema().notNull(),
  provider: text().notNull(),
  providerAccountId: text().notNull(),
  refresh_token: text(),
  access_token: text(),
  expires_at: integer(),
  token_type: text(),
  scope: text(),
  id_token: text(),
  session_state: text(),
});
