import { authService } from '@/api/auth/authService';
import { getUserById } from '@/data-access/users';
import { logger } from '@/server';
import type { SelectUser } from '@repo/database';
import passport from 'passport';
import { type IStrategyOptionsWithRequest, Strategy } from 'passport-local';

const opts: IStrategyOptionsWithRequest = {
  session: true,
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

passport.use(
  new Strategy(opts, async (req, email, password, done) => {
    try {
      const { code } = req.body;

      const result = await authService.validateLocalUser({ email, password, code });

      if (!result.success) {
        return done(null, false);
      }

      const user: Express.User = {
        id: result.data?.id!,
      };

      return done(null, user);
    } catch (error) {
      logger.error('Local strategy error:', error);
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await getUserById<SelectUser>(id, {
    id: true,
    email: true,
  });

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
});

export default passport;
