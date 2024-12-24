import { pgEnum } from "drizzle-orm/pg-core";

export const roleSchema = pgEnum("role", ["member", "admin"]);
export const accountTypeSchema = pgEnum("type", [
  "email",
  "google",
  "facebook",
]);
