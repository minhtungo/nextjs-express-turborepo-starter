import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { accounts } from "./accounts";

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = z.infer<typeof selectAccountSchema>;
