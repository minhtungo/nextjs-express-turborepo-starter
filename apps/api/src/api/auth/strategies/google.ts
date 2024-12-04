import { createAccount, getAccountByUserId } from '@/api/auth/authRepository';
import { userRepository } from '@/api/user/userRepository';
import { env } from '@/common/config/env';

import passport from 'passport';
import { Strategy, type StrategyOptions } from 'passport-google-oauth20';

const opts: StrategyOptions = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  scope: ['profile', 'email'],
};

export default passport.use(
  new Strategy(opts, async (accessToken, refreshToken, profile, done) => {
    const email = profile?.emails?.[0].value;

    if (!email)
      return done(
        {
          code: 'EMAIL_REQUIRED',
          message: 'Email is required from Google account',
        },
        undefined
      );

    try {
      const existingUser = await userRepository.getUserByEmail(email, {
        id: true,
        email: true,
      });

      if (existingUser) {
        const existingAccount = await getAccountByUserId(existingUser.id!);

        if (existingAccount?.provider === 'google') {
          // User already has Google auth set up, proceed with login
          return done(null, existingUser as Express.User);
        } else {
          return done(
            {
              code: 'PROVIDER_CONFLICT',
              message: 'Email already registered with different provider',
            },
            undefined
          );
        }
      }

      const newUser = await userRepository.createUser({
        email,
        emailVerified: new Date(),
        name: profile.displayName,
        image: profile?.photos?.[0].value,
      });

      await createAccount({
        userId: newUser.id,
        type: 'google',
        provider: 'google',
        providerAccountId: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      return done(null, newUser as Express.User);
    } catch (error) {
      return done(
        {
          code: 'AUTH_ERROR',
          message: 'Authentication failed',
        },
        undefined
      );
    }
  })
);
