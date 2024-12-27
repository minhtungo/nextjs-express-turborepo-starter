import { authService } from "@/api/auth/authService";
import { userRepository } from "@/api/user/userRepository";
import { logger } from "@/server";
import type { SessionUser } from "@repo/validation/user";
import passport from "passport";
import { type IStrategyOptionsWithRequest, Strategy } from "passport-local";

const opts: IStrategyOptionsWithRequest = {
  session: true,
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.use(
  new Strategy(opts, async (req, email, password, done) => {
    try {
      const { code } = req.body;
      const user = await authService.validateCredentials(email, password, code);

      if (!user) {
        return done(null, false, {
          message: "Invalid credentials",
        });
      }

      return done(null, user);
    } catch (error) {
      logger.error("Local strategy error:", error);
      return done(error);
    }
  }),
);

passport.serializeUser((user, done) => {
  console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = (await userRepository.getUserById<SessionUser>(id, {
    id: true,
    email: true,
    image: true,
    name: true,
  })) as SessionUser;

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
});

export default passport;
