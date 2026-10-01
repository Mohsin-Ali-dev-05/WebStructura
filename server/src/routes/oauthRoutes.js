import { Router } from 'express';
import passport from 'passport';
import { env } from '../config/env.js';
import { signToken } from '../middleware/authMiddleware.js';
import { formatUser } from '../utils/formatUser.js';

const router = Router();

function ensureGoogleConfigured(req, res, next) {
  if (!env.googleClientId || !env.googleClientSecret) {
    res.redirect(
      `${env.clientOrigin}/login?error=${encodeURIComponent('Google sign-in is not configured.')}`,
    );
    return;
  }
  next();
}

/**
 * GET /auth/google — start Google OAuth consent.
 */
router.get(
  '/auth/google',
  ensureGoogleConfigured,
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: true,
  }),
);

/**
 * GET /auth/google/callback — OAuth redirect; issue JWT and send user to dashboard.
 */
router.get(
  '/auth/google/callback',
  ensureGoogleConfigured,
  (req, res, next) => {
    passport.authenticate('google', (err, user) => {
      if (err || !user) {
        const message = err?.message || 'Google authentication failed.';
        res.redirect(
          `${env.clientOrigin}/login?error=${encodeURIComponent(message)}`,
        );
        return;
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          res.redirect(
            `${env.clientOrigin}/login?error=${encodeURIComponent('Session login failed.')}`,
          );
          return;
        }

        const token = signToken(user._id);
        res.redirect(
          `${env.clientOrigin}/dashboard?token=${encodeURIComponent(token)}`,
        );
      });
    })(req, res, next);
  },
);

/**
 * GET /api/current_user — session user for Passport cookie auth.
 */
router.get('/api/current_user', (req, res) => {
  if (!req.user) {
    res.json({ user: null });
    return;
  }
  res.json({ user: formatUser(req.user) });
});

/**
 * GET /api/logout — destroy Passport session and return to frontend home.
 */
router.get('/api/logout', (req, res, next) => {
  req.logout((logoutErr) => {
    if (logoutErr) {
      next(logoutErr);
      return;
    }

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(`${env.clientOrigin}/`);
    });
  });
});

export default router;
