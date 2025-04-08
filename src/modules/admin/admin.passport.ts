import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { DB } from '../../database';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from '../../config';

const allowedDomains = ['sunstone.in', 'collegesearch.in'];

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      callbackURL: GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Get email from profile
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        // Check if email domain is allowed
        const emailDomain = email.split('@')[1];
        if (!allowedDomains.includes(emailDomain)) {
          return done(new Error('Email domain not allowed'));
        }

        // Find or create admin user
        let user = await DB.User.findOne({ where: { email } });
        
        if (!user) {
          // Create new admin user
          user = await DB.User.create({
            email,
            name: profile.displayName,
            role: 'admin',
            is_active: true,
            google_id: profile.id,
          });
        } else {
          // Update existing user with Google ID if not set
          if (!user.google_id) {
            user.google_id = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await DB.Users.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport; 