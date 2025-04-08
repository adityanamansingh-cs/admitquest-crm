import { Request, Response } from 'express';
import passport from 'passport';

export class AdminAuthController {
  // Initiate Google OAuth login
  static googleLogin(req: Request, res: Response) {
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      prompt: 'select_account',
    })(req, res);
  }

  // Handle Google OAuth callback
  static googleCallback(req: Request, res: Response) {
    passport.authenticate('google', {
      failureRedirect: '/admin/login?error=authentication_failed',
      successRedirect: '/admin',
    })(req, res);
  }

  // Logout
  static logout(req: Request, res: Response) {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/admin/login');
    });
  }

  // Check if user is authenticated
  static checkAuth(req: Request, res: Response) {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  }
} 