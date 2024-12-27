import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";
import { userSettings } from "./userSettings";

export const insertUserSettingsSchema = createInsertSchema(userSettings);
export const selectUserSettingsSchema = createSelectSchema(userSettings);

export type UserSettings = z.infer<typeof selectUserSettingsSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
