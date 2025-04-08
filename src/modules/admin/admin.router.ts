import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import session from 'express-session';
import express from 'express';
import { adminOptions, adminJs } from './admin.config';
import passport from 'passport';

/**
 * Initialize AdminJS with options and authentication
 */
export const setupAdminRouter = async (): Promise<express.Router> => {
  // Session options for authentication
  const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'admitquest-admin-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };
  
  // Build router with authentication
  const router = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      // This is a placeholder since we're using Google OAuth
      return null;
    },
    cookiePassword: process.env.SESSION_SECRET || 'admitquest-admin-secret-key',
  });
  
  // Add session middleware
  router.use(session(sessionOptions));
  
  // Initialize passport
  router.use(passport.initialize());
  router.use(passport.session());
  
  return router;
}; 