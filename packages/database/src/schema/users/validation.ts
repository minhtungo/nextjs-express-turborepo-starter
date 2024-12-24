import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "./users";

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
