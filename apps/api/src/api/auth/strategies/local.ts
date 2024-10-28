import type { LoginResponse } from '@/api/auth/authModel';
import { authService } from '@/api/auth/authService';
import type { AuthJwtUser } from '@/common/types/auth';
import { logger } from '@/server';
import passport from 'passport';
import { type IStrategyOptionsWithRequest, Strategy } from 'passport-local';

const opts: IStrategyOptionsWithRequest = {
  session: false,
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

export default passport.use(
  new Strategy(opts, async (req, email, password, done) => {
    try {
      console.log('local strategy', req.body);
      const { code } = req.body;

      const result = await authService.validateLocalUser({ email, password, code });

      console.log('local strategy result', result);

      if (!result.success) {
        return done(
          {
            message: result.message,
          },
          false
        );
      }

      const user: AuthJwtUser = {
        id: result.data?.id!,
        email: result.data?.email!,
      };

      return done(null, user);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  })
);
