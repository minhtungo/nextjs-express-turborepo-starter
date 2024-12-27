import {
  insertUserSchema,
  selectUserSchema,
} from "@repo/database/schema/users";
import { z } from "zod";
import { commonValidations } from "./common";

const SessionUser = selectUserSchema.pick({
  id: true,
  email: true,
  image: true,
  name: true,
});

export type SessionUser = z.infer<typeof SessionUser>;

export type Session = {
  user: SessionUser;
};

export const updateUserSchema = insertUserSchema.pick({
  image: true,
  name: true,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const changeUserPasswordSchema = z.object({
  currentPassword: z
    .string({
      required_error: "Password is required",
    })
    .min(1),
  newPassword: commonValidations.password,
});

export type ChangeUserPassword = z.infer<typeof changeUserPasswordSchema>;

export const changeUserPasswordFormSchema = changeUserPasswordSchema
  .extend({
    confirmNewPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangeUserPasswordForm = z.infer<
  typeof changeUserPasswordFormSchema
>;
