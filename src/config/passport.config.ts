import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { DB } from '../database';
import { UserRole } from '../types/user.types';
import { config } from './config';

const allowedDomains = ['@sunstone.in', '@collegesearch.in'];

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Check if email domain is allowed
        const isAllowedDomain = allowedDomains.some(domain => email.endsWith(domain));
        if (!isAllowedDomain) {
          return done(new Error('Email domain not allowed'));
        }

        // Find or create user
        let user = await DB.Users.findOne({ where: { email } });
        
        if (!user) {
          user = await DB.Users.create({
            email,
            name: profile.displayName,
            role: UserRole.ADMIN,
            is_active: true,
            google_id: profile.id,
          });
        } else if (!user.google_id) {
          // Update existing user with Google ID
          user.google_id = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// JWT Strategy for API authentication
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (jwtPayload, done) => {
      try {
        const user = await DB.Users.findByPk(jwtPayload.id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport; 