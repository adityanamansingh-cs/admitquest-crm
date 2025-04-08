import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { DB } from '../../database';
import { UserRole } from '../../types/user.types';

export const adminAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Skip auth check for login and auth routes
    if (req.path === '/login' || req.path.startsWith('/auth/')) {
      return next();
    }

    // Check if user is authenticated via Google OAuth
    if (!req.isAuthenticated()) {
      return res.redirect('/admin/login');
    }

    // Get the authenticated user
    const user = req.user;
    if (!user) {
      return res.redirect('/admin/login');
    }

    // Check if user is admin
    const dbUser = await DB.User.findByPk(user.id);
    if (!dbUser || dbUser.role !== UserRole.ADMIN) {
      req.logout((err) => {
        if (err) console.error('Logout error:', err);
      });
      return res.redirect('/admin/login');
    }

    // Attach user to request
    req.user = dbUser;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    req.logout((err) => {
      if (err) console.error('Logout error:', err);
    });
    res.redirect('/admin/login');
  }
}; 