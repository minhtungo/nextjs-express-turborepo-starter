import { env } from "@/common/config/env";
import { createAccount } from "@/data-access/accounts";
import { createUser, getUserByEmail } from "@/data-access/users";
import passport from "passport";
import { Strategy, type StrategyOptions } from "passport-google-oauth20";

const opts: StrategyOptions = {
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_CALLBACK_URL,
  scope: ["profile", "email"],
};

export default passport.use(
  new Strategy(opts, async (accessToken, refreshToken, profile, done) => {
    const email = profile?.emails?.[0].value;

    if (!email) return done(null, undefined);

    let existingUser = undefined;

    try {
      existingUser = await getUserByEmail(email, {
        id: true,
      });

      if (existingUser) {
        return done(null, existingUser);
      }
    } catch (error) {
      return done(error, undefined);
    }

    try {
      if (existingUser) return;

      const newUser = await createUser({
        email,
        emailVerified: new Date(),
        name: profile.displayName,
        image: profile?.photos?.[0].value,
      });

      await createAccount({
        userId: newUser.id,
        type: "google",
        provider: "google",
        providerAccountId: profile.id,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      done(null, newUser);
    } catch (error) {
      return done(error, undefined);
    }
  }),
);
