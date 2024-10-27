import type { AuthJwtPayload, AuthJwtUser } from "@/common/types/auth";
import { env } from "@/common/utils/env";
import { UnauthorizedError } from "@/common/utils/errors";
import { getUserById } from "@/data-access/users";
import passport from "passport";
import { ExtractJwt, Strategy, type StrategyOptionsWithoutRequest } from "passport-jwt";

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.ACCESS_TOKEN_SECRET,
  algorithms: [env.JWT_ALGORITHM],
  ignoreExpiration: false,
};

export default passport.use(
  new Strategy(opts, async (payload: AuthJwtPayload, done) => {
    try {
      console.log("jwt strategy", payload);

      const user = await getUserById<AuthJwtUser>(payload.sub, {
        id: true,
        email: true,
      });
      console.log("jwt strategy user", user);

      if (!user) throw new UnauthorizedError("User not found");
      done(null, user);
    } catch (err) {
      console.log("err", err);
      done(err, null);
    }
  }),
);
