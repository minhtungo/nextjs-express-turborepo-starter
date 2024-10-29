import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type NextFunction, type Request, type Response, type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { authController } from "@/api/auth/authController";
import {
  AuthResponseSchema,
  ChangePasswordSchema,
  LoginInputSchema,
  PostForgotPasswordSchema,
  PostResetPasswordSchema,
  PostSignOutSchema,
  PostVerifyEmailSchema,
  ResetPasswordSchema,
  SignUpInputSchema,
  TokensSchema,
  VerifyEmailSchema,
} from "@/api/auth/authModel";
import { ServiceResponse } from "@/common/models/serviceResponse";
import type { AuthJwtUser } from "@/common/types/auth";
import { handleServiceResponse, validateRequest } from "@/common/utils/httpHandlers";
import isAuthenticated from "@/middleware/isAuthenticated";
import { StatusCodes } from "http-status-codes";
import passport from "passport";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/sign-in",
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
  "/sign-in",
  validateRequest(z.object({ body: LoginInputSchema })),
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, (error: any, user: AuthJwtUser | false) => {
      if (error || !user) {
        const failureResponse = ServiceResponse.failure(
          error.message || "Authentication failed",
          null,
          StatusCodes.UNAUTHORIZED,
        );
        return handleServiceResponse(failureResponse, res);
      }
      // Authentication succeeded
      console.log("Authentication succeeded", req.user);
      req.user = user;
      next();
    })(req, res, next);
  },
  authController.signIn,
);

authRegistry.registerPath({
  method: "post",
  tags: ["Auth"],
  path: "/auth/sign-up",
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

authRouter.post("/sign-up", validateRequest(z.object({ body: SignUpInputSchema })), authController.signUp);

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

authRouter.post("/reset-password", validateRequest(PostResetPasswordSchema), authController.resetPassword);

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

authRouter.post("/verify-email", validateRequest(PostVerifyEmailSchema), authController.verifyEmail);

authRouter.post("/sign-out", isAuthenticated, authController.signOut);

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

authRouter.post(
  "/refresh-token",
  validateRequest(z.object({ body: z.object({ refreshToken: z.string() }) })),
  passport.authenticate("refresh-token", { session: false }),
  authController.handleRefreshToken,
);

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

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login", session: false }),
  authController.handleGoogleCallback,
);
