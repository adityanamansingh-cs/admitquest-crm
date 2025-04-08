import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Load environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
// Use the environment variable or fallback to the provided redirect URI
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/google/callback';
const ALLOWED_EMAIL_DOMAINS = (process.env.ALLOWED_EMAIL_DOMAINS || '').split(',').filter(Boolean);

// User profile interface
interface UserProfile {
    id: string;
    displayName: string;
    emails?: { value: string; verified?: boolean }[];
    photos?: { value: string }[];
}

// Configure Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
        },
        (accessToken: string, refreshToken: string, profile: UserProfile, done: Function) => {
            // Check if user email is from allowed domain
            const userEmail = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
            const emailDomain = userEmail.split('@')[1];
            
            if (!userEmail || (ALLOWED_EMAIL_DOMAINS.length > 0 && !ALLOWED_EMAIL_DOMAINS.includes(emailDomain))) {
                logger.warn(`Login attempt with unauthorized email domain: ${emailDomain}`);
                
                const domainList = ALLOWED_EMAIL_DOMAINS.map(domain => `@${domain}`).join(' or ');
                return done(null, false, { 
                    message: `Authentication failed: You must use an email address from ${domainList} to access this API documentation.` 
                });
            }
            
            // User is authenticated
            const user = {
                id: profile.id,
                displayName: profile.displayName,
                email: userEmail,
                photo: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
            };
            
            return done(null, user);
        }
    )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
});

// Middleware to check if user is authenticated
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    if (req.isAuthenticated()) {
        return next();
    }
    
    // Remember the original URL the user was trying to access
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
};

// Middleware to ensure user is from allowed domain
export const ensureAllowedDomain = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
        res.redirect('/auth/login');
        return;
    }
    
    const user = req.user as any;
    const email = user.email;
    
    if (!email) {
        res.status(401).json({ message: 'Access denied: Email not provided' });
        return;
    }
    
    const domain = email.split('@')[1];
    
    if (ALLOWED_EMAIL_DOMAINS.length > 0 && !ALLOWED_EMAIL_DOMAINS.includes(domain)) {
        const domainList = ALLOWED_EMAIL_DOMAINS.map(domain => `@${domain}`).join(' or ');
        res.status(401).json({ 
            message: `Access denied: You must use an email address from ${domainList} to access this API documentation.`
        });
        return;
    }
    
    next();
};

export default passport; 