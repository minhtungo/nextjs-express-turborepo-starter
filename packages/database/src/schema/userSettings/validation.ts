import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userSettings } from "./userSettings";

export const insertUserSettingSchema = createInsertSchema(userSettings);
export const selectUserSettingSchema = createSelectSchema(userSettings);
