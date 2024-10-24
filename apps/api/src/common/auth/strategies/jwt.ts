import { AuthJwtPayload, AuthJwtUser } from '@/common/types/auth';
import { env } from '@/common/utils/env';
import { UnauthorizedError } from '@/common/utils/errors';
import { getUserById } from '@/data-access/users';
import passport from 'passport';
import { ExtractJwt, Strategy, type StrategyOptionsWithoutRequest } from 'passport-jwt';

const opts: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.ACCESS_TOKEN_SECRET,
  algorithms: [env.JWT_ALGORITHM],
  ignoreExpiration: false,
};

export default passport.use(
  new Strategy(opts, async (payload: AuthJwtPayload, done) => {
    try {
      const user = (await getUserById(payload.sub, {
        id: true,
        email: true,
      })) as AuthJwtUser;

      if (!user) throw new UnauthorizedError('User not found');
      done(null, user);
    } catch (err) {
      console.log('err', err);
      done(err, null);
    }
  })
);
