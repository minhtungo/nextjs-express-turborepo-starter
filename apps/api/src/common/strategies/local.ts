import { createSessionUserDTO } from '@api/common/lib/dto';
import AuthService from '@api/modules/auth/authService';
import UserRepository from '@api/modules/user/userRepository';
import { logger } from '@repo/logger';
import passport from 'passport';
import { type IStrategyOptionsWithRequest, Strategy } from 'passport-local';

const opts: IStrategyOptionsWithRequest = {
  session: true,
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
};

// passport.use(
//   new Strategy(opts, async (req, email, password, done) => {
//     try {
//       console.log('testing');
//       const { code } = req.body;

//       const result = await AuthService.authenticateUser(email, password, code);

//       if (!result.success) {
//         return done(null, false, {
//           message: 'Invalid credentials',
//         });
//       }

//       return done(null, result.data);
//     } catch (error) {
//       logger.error('Local strategy error:', error);
//       return done(error);
//     }
//   })
// );

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  const user = await UserRepository.getUserById(id);

  if (!user) {
    return done(null, false);
  }

  const sessionUser = createSessionUserDTO(user);

  return done(null, sessionUser);
});

export default passport;
