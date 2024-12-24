import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { twoFactorTokens } from "./twoFactorTokens";

export const insertTwoFactorTokenSchema = createInsertSchema(twoFactorTokens);
export const selectTwoFactorTokenSchema = createSelectSchema(twoFactorTokens);
