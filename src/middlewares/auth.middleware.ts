import { CustomError } from '@/utils/custom-error';
import { verifyJWT } from './jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { DB } from '@/database';

const decodeToken = async (header: string | undefined) => {
    if (!header) {
        throw new CustomError('Authorization header missing', 401);
    }

    const token = header.replace('Bearer ', '');
    try {
        const payload = await verifyJWT(
            token,
            JWT_ACCESS_TOKEN_SECRET as string,
        );
        return payload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new CustomError('Token has expired', 401);
        }
        throw new CustomError('Invalid token', 401);
    }
};

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { method, path } = req;

    if (
        method === 'OPTIONS' ||
        ['/api/auth/signin', '/api/auth/refresh-token'].includes(path)
    ) {
        return next();
    }

    try {
        const authHeader =
            req.header('Authorization') || req.header('authorization');
        req.context = await decodeToken(authHeader);
        next();
    } catch (error) {
        next(error);
    }
};

export const isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.header('Authorization') || req.header('authorization');
        req.context = await decodeToken(authHeader);
        next();
    } catch (error) {
        next(error);
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.context || !req.context.userId) {
            throw new CustomError('Unauthorized', 401);
        }

        const user = await DB.Users.findByPk(req.context.userId);
        
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        if (user.role !== 'admin') {
            throw new CustomError('Access denied: Admin role required', 403);
        }

        next();
    } catch (error) {
        next(error);
    }
};
