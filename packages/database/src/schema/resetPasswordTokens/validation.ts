import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { resetPasswordTokens } from "./resetPasswordTokens";

export const insertResetPasswordTokenSchema =
  createInsertSchema(resetPasswordTokens);
export const selectResetPasswordTokenSchema =
  createSelectSchema(resetPasswordTokens);
