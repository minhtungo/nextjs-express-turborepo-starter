import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authController } from "@/api/auth/authController";
import {
  AuthResponseSchema,
  ChangePasswordSchema,
  LoginInputSchema,
  PostForgotPasswordSchema,
  PostResetPasswordSchema,
  PostVerifyEmailSchema,
  ResetPasswordSchema,
  SignUpInput,
  SignUpInputSchema,
  TokensSchema,
  VerifyEmailSchema,
} from "@/api/auth/authModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import passport from "passport";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/login",
  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginInputSchema,
        },
      },
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Success"),
});

authRouter.post(
  "/login",
  validateRequest(z.object({ body: LoginInputSchema })),
  passport.authenticate("local", { session: false, failWithError: true }),
  authController.login,
);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/signup",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SignUpInputSchema,
        },
      },
    },
  },
  responses: createApiResponse(AuthResponseSchema, "Success"),
});

authRouter.post("/signup", validateRequest(z.object({ body: SignUpInputSchema })), authController.signUp);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/reset-password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ResetPasswordSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), "Success"),
});

authRouter.post("/reset-password/:token", validateRequest(PostResetPasswordSchema), authController.resetPassword);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/forgot-password",
  request: {
    body: {
      content: {
        "application/json": {
          schema: ChangePasswordSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), "Success"),
});

authRouter.post("/forgot-password", validateRequest(PostForgotPasswordSchema), authController.forgotPassword);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/logout",
  request: {},
  responses: createApiResponse(z.string().nullable(), "Success"),
});
authRouter.post("/logout", authController.logout);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/verify-email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyEmailSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), "Success"),
});

authRouter.post("/verify-email/:token", validateRequest(PostVerifyEmailSchema), authController.verifyEmail);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/send-verification-email",
  request: {
    body: {
      content: {
        "application/json": {
          schema: VerifyEmailSchema,
        },
      },
    },
  },
  responses: createApiResponse(z.string().nullable(), "Success"),
});

authRouter.post(
  "/send-verification-email",
  validateRequest(PostVerifyEmailSchema),
  authController.sendVerificationEmail,
);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/refresh-token",
  request: {},
  responses: createApiResponse(TokensSchema, "Success"),
});

authRouter.get("/refresh-token", authController.handleRefreshToken);

authRegistry.registerPath({
  method: "get",
  tags: ["Auth"],
  path: "/auth/google",
  request: {},
  responses: createApiResponse(TokensSchema, "Success"),
});

authRouter.get(
  "/google",
  passport.authenticate("google", {
    session: false,
  }),
);

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/login", session: false }));
