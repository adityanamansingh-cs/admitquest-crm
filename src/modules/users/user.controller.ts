import { NextFunction, Request, Response } from 'express';
import { createUser } from './user.service';
import { CustomError } from '@/utils/custom-error';

export const createUserController = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, name, password, role } = req.body;

        // Validate required fields
        if (!email || !name || !password) {
            throw new CustomError('Email, name, and password are required', 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CustomError('Invalid email format', 400);
        }

        // Validate password strength
        if (password.length < 8) {
            throw new CustomError('Password must be at least 8 characters long', 400);
        }

        // Create the user
        const newUser = await createUser({
            email,
            name,
            password,
            role
        });

        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        next(error);
    }
}; 