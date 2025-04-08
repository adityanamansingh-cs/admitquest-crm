import express from 'express';
import { adminJs, adminRouter } from './admin.config';
import adminRoutes from './admin.routes';
import passport from './admin.passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';

export const setupAdminRouter = (): express.Router => {
  const router = express.Router();
  
  // Parse cookies
  router.use(cookieParser());
  
  // Set up session
  router.use(session({
    secret: process.env.SESSION_SECRET || 'admitquest-admin-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));
  
  // Initialize passport
  router.use(passport.initialize());
  router.use(passport.session());
  
  // Custom routes for Google OAuth
  router.use(adminRoutes);
  
  // AdminJS routes - mount at root
  router.use(adminRouter);
  
  return router;
}; 