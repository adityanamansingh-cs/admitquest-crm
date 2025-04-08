import authRouter from '@/modules/auth/auth.routes';
import userRouter from '@/modules/user/user.routes';
import utilsRouter from '@/modules/utils/utils.routes';
import express, { Router } from 'express';
import { createUserController } from '@/modules/users/user.controller';
import { isAuthenticated, isAdmin } from '@/middlewares/auth.middleware';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/utils', utilsRouter);

// User routes
router.post('/users', isAuthenticated, isAdmin, createUserController);

export default router;
