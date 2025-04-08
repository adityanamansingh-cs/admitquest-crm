import { NextFunction, Request, Response } from 'express';
import {
    refreshTokenService,
    signInService,
    signUpService,
    verifyOTPService,
    resendOTPService,
} from './auth.service';

export const signUpController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        const response = await signUpService(userData);

        res.status(201).json({
            message: 'Successfully signed up',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const verifyOTPController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { mobile, otp } = req.body;
        const response = await verifyOTPService(mobile, otp);

        res.status(200).json({
            message: 'OTP verified successfully',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const signInController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const userData = req.body;
        const response = await signInService(userData);

        res.status(200).json({
            message: 'Successfully signed in',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const refreshTokenController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const refreshToken = req.body.refreshToken;
        const response = await refreshTokenService(refreshToken);

        res.status(200).json({
            message: 'Successfully refreshed token',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};

export const resendOTPController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { mobile } = req.body;
        const response = await resendOTPService(mobile);

        res.status(200).json({
            message: 'OTP resent successfully',
            data: response,
        });
    } catch (error) {
        next(error);
    }
};
