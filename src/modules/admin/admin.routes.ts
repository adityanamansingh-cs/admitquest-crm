import { Router } from 'express';
import passport from 'passport';
import { AdminController } from './admin.controller';
import { AdminAuthController } from './admin.auth.controller';
import { adminAuthMiddleware } from './admin.middleware';
import { config } from '../../config/config';

const router = Router();

// Public routes
router.get('/login', AdminController.login);
router.get('/auth/google', AdminAuthController.googleLogin);
router.get('/auth/google/callback', AdminAuthController.googleCallback);
router.get('/auth/logout', AdminAuthController.logout);
router.get('/auth/check', AdminAuthController.checkAuth);

// Protected routes
router.use(adminAuthMiddleware);
// No need for root redirect as AdminJS will handle it

export default router; 