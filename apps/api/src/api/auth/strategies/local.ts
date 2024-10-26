import { authService } from "@/api/auth/authService";
import { logger } from "@/server";
import passport from "passport";
import { type IStrategyOptionsWithRequest, Strategy } from "passport-local";

const opts: IStrategyOptionsWithRequest = {
  session: false,
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

export default passport.use(
  new Strategy(opts, async (req, email, password, done) => {
    try {
      const { code } = req.body;

      const result = await authService.login({ email, password, code });

      if (!result.success) {
        return done(null, false, { message: result.message });
      }

      return done(null, { user: result.data });
    } catch (error) {
      logger.error("Local strategy error:", error);
      return done(error);
    }
  }),
);
