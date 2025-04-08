// user.validator.js
import Joi from 'joi';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { Request } from 'express';

const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    abortEarly: false,
};

export const validateUpdateUser = (userData: any) => {
    const schema = Joi.object({
        name: Joi.string().min(1).max(255).optional().messages({
            'string.min': 'Name should be at least 1 character',
            'string.max': 'Name should not exceed 255 characters',
        }),
        email: Joi.string().email().max(255).optional().messages({
            'string.email': 'Email format is invalid',
            'string.max': 'Email should not exceed 255 characters',
        }),
        course_id: Joi.number().optional(),
        image: Joi.string().max(255).optional(),
        mobile: Joi.forbidden().messages({
            'any.unknown': 'Mobile number cannot be updated',
        }),
    });

    return schema.validate(userData, options);
};

interface ValidatedUser {
    userId: number;
    user: any; // or replace `any` with a proper User type if available
}

export const validateAndGetUser = async (accessToken: string): Promise<ValidatedUser> => {
    const decoded = await verifyJWT(accessToken, JWT_ACCESS_TOKEN_SECRET as string);

    if (!decoded?.userId) {
        throw new CustomError('Invalid token', 401);
    }

    const user = await repo.getUserProfile(decoded.userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    return {
        userId: decoded.userId,
        user,
    };
};



export const extractAccessToken = (req: Request): string => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new CustomError('Unauthorized', 401);
    }

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) {
        throw new CustomError('Access token missing', 401);
    }

    return accessToken;
};
