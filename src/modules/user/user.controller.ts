import { NextFunction, Request, Response } from 'express';
import { extractAccessToken } from './user.validator';
import { verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import {
    getApplicationService,
    getCartService,
    getUserProfileService,
    createApplicationService,
    updateUserService,
    removeApplicationService,
} from './user.service';
import { CustomError } from '@/utils/custom-error';

export const getUserProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const response = await getUserProfileService(accessToken);
        res.status(200).json({ message: 'User data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const getApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const response = await getApplicationService(accessToken);
        res.status(200).json({
            message: 'Application data fetched',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const getCartController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const response = await getCartService(accessToken);
        res.status(200).json({ message: 'Cart data fetched', data: response });
    } catch (error) {
        next(error);
    }
};

export const createApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const applicationData = req.body;
        const response = await createApplicationService(accessToken, applicationData);

        res.status(201).json({
            message: 'Application created successfully',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const removeApplicationController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const applicationData = req.body;
        const response = await removeApplicationService(accessToken, applicationData);

        res.status(201).json({
            message: 'Application removed successfully',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const accessToken = extractAccessToken(req);
        const payload = await verifyJWT(accessToken, JWT_ACCESS_TOKEN_SECRET as string);

        if (!payload || !payload.userId) {
            throw new CustomError('Invalid access token', 401);
        }

        const response = await updateUserService(payload.userId, req.body);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
