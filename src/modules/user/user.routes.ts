import express from 'express';
import {
    createApplicationController,
    getApplicationController,
    getCartController,
    getUserProfileController,
    removeApplicationController,
    updateUserController,
} from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';


const userRouter = express.Router();

userRouter.get('/profile', authMiddleware, getUserProfileController);
userRouter.patch('/profile', authMiddleware, updateUserController);
userRouter.get('/applications', authMiddleware, getApplicationController);
userRouter.post('/applications/create', authMiddleware, createApplicationController);
userRouter.post('/applications/remove', authMiddleware, removeApplicationController);
userRouter.get('/carts', authMiddleware, getCartController);

export default userRouter;
