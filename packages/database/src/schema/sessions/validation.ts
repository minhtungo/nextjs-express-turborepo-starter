import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { sessions } from "./sessions";

export type InsertSession = typeof sessions.$inferInsert;
export type SelectSession = typeof sessions.$inferSelect;

export const insertSessionSchema = createInsertSchema(sessions);
export const selectSessionSchema = createSelectSchema(sessions);
