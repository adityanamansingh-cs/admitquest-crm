// import { User } from '@/interfaces/user.interfaces';
import { Student, StudentModel } from '@/database/models/student.model';
import {
    validateSignIn,
    validateSignUp,
    validateVerifyOTP,
    validateRefreshToken,
    validateResendOTP,
} from './auth.validator';
import repo from './auth.repo';
import { generateJWT, verifyJWT } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { CustomError } from '@/utils/custom-error';
import { CommunicationService } from '@/services/CommunicationService';
import axios from 'axios';

export const signUpService = async (userData: Partial<StudentModel>) => {
    try {
        const { error } = validateSignUp(userData);
        if (error) {
            throw new CustomError(
                `Validation error: ${
                    error.details[0].message
                } (Field: ${error.details[0].path.join('.')})`,
                400,
            );
        }

        const findUser = await repo.findUserByMobile(userData.mobile!);
        if (findUser) {
            throw new CustomError(
                `Mobile number ${userData.mobile} already exists`,
                409,
            );
        }

        // Insert student data into database with active status
        const studentData = {
            ...userData,
            status: 'active',
            is_mobile_verified: false,
            is_email_verified: false,
            email: userData.email,
        } as StudentModel;

        const newStudent = await repo.createUser(studentData);

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        await repo.updateStudentOTP(userData.mobile!, otp);

        const smsApiUrl = `https://japi.instaalerts.zone/httpapi/QueryStringReceiver`;
        const params = {
            ver: '1.0',
            key: 'kzT3O5W3hlcknO3hqrJO9Q==',
            encrpt: '0',
            dest: `91${userData.mobile}`,
            send: 'CLGSCH',
            text: `${otp} is your CollegeSearch Mobile Verification OTP`,
        };

        try {
            const response = await axios.get(smsApiUrl, { params });
        } catch (smsError: any) {
            console.error(
                'Failed to send OTP via SMS:',
                smsError.response?.data || smsError.message,
            );
        }

        return {
            message: 'OTP sent successfully',
            student: {
                id: newStudent.id,
                name: newStudent.name,
                mobile: newStudent.mobile,
                email: newStudent.email,
                status: newStudent.status,
            },
        };
    } catch (error: any) {
        console.error('Error in signUpService:', {
            error,
            stack: error?.stack,
            userData: {
                ...userData,
                email: userData.email ? 'REDACTED' : undefined,
            },
        });
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError(
            `Failed to sign up: ${error?.message || 'Unknown error'}`,
            500,
        );
    }
};

export const verifyOTPService = async (mobile: string, otp: string) => {
    const { error } = validateVerifyOTP({ mobile, otp });
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const student = await repo.findUserByMobile(mobile);
    if (!student) {
        throw new CustomError('Invalid mobile number', 401);
    }

    if (student.otp !== otp) {
        throw new CustomError('Invalid OTP', 401);
    }

    if (student.otp_expiry && student.otp_expiry < new Date()) {
        throw new CustomError('OTP has expired', 401);
    }

    // Update mobile verification status
    student.is_mobile_verified = true;
    await student.save();

    const payload = {
        userId: student.id,
    };

    const accessToken = await generateJWT(
        payload,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    return {
        student: {
            id: student.id,
            name: student.name,
            mobile: student.mobile,
            email: student.email,
            status: student.status,
            is_mobile_verified: student.is_mobile_verified,
            is_email_verified: student.is_email_verified,
        },
        accessToken,
    };
};

export const signInService = async (userData: { mobile: string }) => {
    //validateSignIn function is missing
    const { error } = validateSignIn(userData);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const user = await repo.findUserByMobile(userData.mobile);
    if (!user) {
        throw new CustomError('Invalid mobile number', 401);
    }

    //send OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await repo.updateStudentOTP(userData.mobile, otp);

    const smsApiUrl = `https://japi.instaalerts.zone/httpapi/QueryStringReceiver`;
    const params = {
        ver: '1.0',
        key: 'kzT3O5W3hlcknO3hqrJO9Q==',
        encrpt: '0',
        dest: `91${userData.mobile}`,
        send: 'CLGSCH',
        text: `${otp} is your CollegeSearch Mobile Verification OTP`,
    };

    try {
        const response = await axios.get(smsApiUrl, { params });
    } catch (smsError: any) {
        console.error(
            'Failed to send OTP via SMS:',
            smsError.response?.data || smsError.message,
        );
    }

    return {
        message: 'OTP sent successfully',
        student: {
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            status: user.status,
        },
    };
};

export const refreshTokenService = async (refreshToken: string) => {
    const { error } = validateRefreshToken({ refreshToken });
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    //verify the refresh token
    const payload = await verifyJWT(
        refreshToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    if (!payload) {
        throw new CustomError('Invalid refresh token', 401);
    }

    //generate new access token
    const accessToken = await generateJWT(
        payload,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    return { accessToken };
};

export const resendOTPService = async (mobile: string) => {
    const { error } = validateResendOTP({ mobile });
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const user = await repo.findUserByMobile(mobile);
    if (!user) {
        throw new CustomError('Invalid mobile number', 401);
    }

    // Check if OTP was generated within the last minute
    if (user.otp_expiry) {
        const oneMinuteAgo = new Date();
        oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
        
        // Calculate when the OTP was generated (10 minutes before expiry)
        const otpGeneratedAt = new Date(user.otp_expiry);
        otpGeneratedAt.setMinutes(otpGeneratedAt.getMinutes() - 10);
        
        if (otpGeneratedAt > oneMinuteAgo) {
            const timeLeft = Math.ceil((otpGeneratedAt.getTime() - oneMinuteAgo.getTime()) / 1000);
            throw new CustomError(
                `Please wait ${timeLeft} seconds before requesting a new OTP`,
                429
            );
        }
    }

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await repo.updateStudentOTP(mobile, otp);

    const smsApiUrl = `https://japi.instaalerts.zone/httpapi/QueryStringReceiver`;
    const params = {
        ver: '1.0',
        key: 'kzT3O5W3hlcknO3hqrJO9Q==',
        encrpt: '0',
        dest: `91${mobile}`,
        send: 'CLGSCH',
        text: `${otp} is your CollegeSearch Mobile Verification OTP`,
    };

    try {
        const response = await axios.get(smsApiUrl, { params });
    } catch (smsError: any) {
        console.error(
            'Failed to send OTP via SMS:',
            smsError.response?.data || smsError.message,
        );
    }

    return {
        message: 'OTP resent successfully',
        student: {
            id: user.id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            status: user.status,
        },
    };
};
