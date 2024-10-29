import { authService } from "@/api/auth/authService";
import { env } from "@/common/config/env";
import type { AuthJwtPayload } from "@/common/types/auth";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import passport from "passport";
import { ExtractJwt, Strategy, type StrategyOptionsWithoutRequest } from "passport-jwt";

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
  secretOrKey: env.REFRESH_TOKEN_SECRET,
  algorithms: [env.JWT_ALGORITHM],
  ignoreExpiration: false,
  passReqToCallback: true,
};

export default passport.use(
  "refresh-token",
  new Strategy(opts, async (req: Request, payload: AuthJwtPayload, done: VerifiedCallback) => {
    try {
      const userId = payload.sub;
      const refreshToken = req.body?.refreshToken;

      const user = await authService.validateRefreshToken(userId, refreshToken);

      done(null, { id: user.id, email: user.email });
    } catch (err) {
      console.log("err", err);
      done(err, null);
    }
  }),
);
