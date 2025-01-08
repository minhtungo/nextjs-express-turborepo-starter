import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users';

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
