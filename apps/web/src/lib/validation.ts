import { passwordRegex } from "@/lib/regex";
import { z } from "zod";

export const commonValidations = {
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(64, "Password must be at most 64 characters")
    .regex(passwordRegex, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
};
