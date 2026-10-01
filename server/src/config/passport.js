import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import User from '../models/User.js';

/**
 * Configure Passport Google OAuth + session serialize/deserialize.
 * Call once at server startup after env is loaded.
 */
export function configurePassport() {
  if (!env.googleClientId || !env.googleClientSecret) {
    console.warn(
      '[passport] GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set — Google OAuth disabled.',
    );
  } else {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.googleClientId,
          clientSecret: env.googleClientSecret,
          callbackURL: env.googleCallbackUrl,
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const googleId = profile.id;
            const email = profile.emails?.[0]?.value?.toLowerCase()?.trim();
            const displayName =
              profile.displayName?.trim() ||
              profile.name?.givenName ||
              email?.split('@')[0] ||
              'Google User';
            const avatar =
              profile.photos?.[0]?.value || null;

            if (!email) {
              return done(
                new Error('Google account did not provide an email address.'),
                null,
              );
            }

            let user = await User.findOne({ googleId });

            if (!user) {
              user = await User.findOne({ email });
              if (user) {
                user.googleId = googleId;
                if (!user.avatarUrl && avatar) {
                  user.avatarUrl = avatar;
                }
                if (!user.name && displayName) {
                  user.name = displayName;
                }
                await user.save();
              } else {
                user = await User.create({
                  googleId,
                  email,
                  name: displayName.slice(0, 80),
                  avatarUrl: avatar,
                });
              }
            } else if (avatar && user.avatarUrl !== avatar) {
              user.avatarUrl = avatar;
              await user.save();
            }

            return done(null, user);
          } catch (err) {
            return done(err, null);
          }
        },
      ),
    );
  }

  passport.serializeUser((user, done) => {
    done(null, user._id.toString());
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user || false);
    } catch (err) {
      done(err, null);
    }
  });

  return passport;
}

export default passport;
