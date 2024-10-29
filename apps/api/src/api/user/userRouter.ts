import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { UserSchema } from "@/api/user/userModel";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
  method: "get",
  path: "/users",
  tags: ["User"],
  responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.post("/", userController.getUsers);

// userRegistry.registerPath({
//   method: "get",
//   path: "/users/{id}",
//   tags: ["User"],
//   request: { params: GetUserSchema.shape.params },
//   responses: createApiResponse(UserSchema, "Success"),
// });

// userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);
