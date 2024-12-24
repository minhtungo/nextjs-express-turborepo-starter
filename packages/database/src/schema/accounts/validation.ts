import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { accounts } from "./accounts";

export const insertAccountSchema = createInsertSchema(accounts);
export const selectAccountSchema = createSelectSchema(accounts);
