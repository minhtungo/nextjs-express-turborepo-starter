import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@repo/validation/common";
import { z } from "zod";

extendZodWithOpenApi(z);

export type User = z.infer<typeof UserSchema>;

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
