import {
    signUpService,
    signInService,
    verifyOTPService
} from '../../../src/modules/auth/auth.service';
import { CustomError } from '../../../src/utils/custom-error';
import repo from '../../../src/modules/auth/auth.repo';
import { StudentModel } from '../../../src/database/models/student.model';
import { validateSignUp, validateVerifyOTP } from '../../../src/modules/auth/auth.validator';
import { generateJWT } from '../../../src/middlewares/jwt.service';
import axios from 'axios';

jest.mock('../../../src/modules/auth/auth.repo');
jest.mock('../../../src/modules/auth/auth.validator');
jest.mock('../../../src/middlewares/jwt.service');
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Auth Service', () => {
    const mockUserData = {
        name: 'Test User',
        mobile: '1234567890',
        email: 'test@example.com'
    };

    const mockStudent = {
        id: '1',
        name: 'Test User',
        mobile: '1234567890',
        email: 'test@example.com',
        status: 'active',
        is_mobile_verified: false,
        is_email_verified: false,
        otp: '123456',
        otp_expiry: new Date(Date.now() + 600000), // 10 minutes from now
        save: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signUpService', () => {
        it('should successfully sign up a new user', async () => {
            // Mock repository responses
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(null);
            (repo.createUser as jest.Mock).mockResolvedValue(mockStudent);
            (repo.updateStudentOTP as jest.Mock).mockResolvedValue(true);
            (validateSignUp as jest.Mock).mockReturnValue({ error: null });
            mockedAxios.get.mockResolvedValue({ data: { status: 'success' } });

            const result = await signUpService(mockUserData);

            expect(result).toHaveProperty('message', 'OTP sent successfully');
            expect(result.student).toHaveProperty('id', mockStudent.id);
            expect(result.student).toHaveProperty('name', mockStudent.name);
            expect(result.student).toHaveProperty('mobile', mockStudent.mobile);
            expect(result.student).toHaveProperty('email', mockStudent.email);
            expect(result.student).toHaveProperty('status', mockStudent.status);
        });

        it('should throw error if mobile number already exists', async () => {
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(mockStudent);
            (validateSignUp as jest.Mock).mockReturnValue({ error: null });

            await expect(signUpService(mockUserData)).rejects.toThrow(
                new CustomError(`Mobile number ${mockUserData.mobile} already exists`, 409)
            );
        });

        it('should throw error if validation fails', async () => {
            (validateSignUp as jest.Mock).mockReturnValue({
                error: { details: [{ message: 'Mobile number is required' }] }
            });

            await expect(signUpService({ name: 'Test User' })).rejects.toThrow(
                new CustomError('Validation error: Mobile number is required (Field: mobile)', 400)
            );
        });
    });

    describe('verifyOTPService', () => {
        it('should successfully verify OTP', async () => {
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(mockStudent);
            (repo.updateStudentOTP as jest.Mock).mockResolvedValue(true);
            (validateVerifyOTP as jest.Mock).mockReturnValue({ error: null });
            (generateJWT as jest.Mock).mockResolvedValue('mocked_access_token');

            const result = await verifyOTPService(mockStudent.mobile, mockStudent.otp);

            expect(result).toHaveProperty('student');
            expect(result).toHaveProperty('accessToken');
            expect(result.student.is_mobile_verified).toBe(true);
            expect(result.accessToken).toBe('mocked_access_token');
        });

        it('should throw error for invalid OTP', async () => {
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(mockStudent);
            (validateVerifyOTP as jest.Mock).mockReturnValue({ error: null });

            await expect(verifyOTPService(mockStudent.mobile, '000000')).rejects.toThrow(
                new CustomError('Invalid OTP', 401)
            );
        });

        it('should throw error for expired OTP', async () => {
            const expiredStudent = {
                ...mockStudent,
                otp_expiry: new Date(Date.now() - 600000) // 10 minutes ago
            };
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(expiredStudent);
            (validateVerifyOTP as jest.Mock).mockReturnValue({ error: null });

            await expect(verifyOTPService(expiredStudent.mobile, expiredStudent.otp)).rejects.toThrow(
                new CustomError('OTP has expired', 401)
            );
        });

        it('should throw error if validation fails', async () => {
            (validateVerifyOTP as jest.Mock).mockReturnValue({
                error: { details: [{ message: 'Invalid mobile number format' }] }
            });

            await expect(verifyOTPService('invalid', '123456')).rejects.toThrow(
                new CustomError('Invalid mobile number format', 400)
            );
        });
    });

    describe('signInService', () => {
        it('should successfully initiate sign in process', async () => {
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(mockStudent);
            (repo.updateStudentOTP as jest.Mock).mockResolvedValue(true);
            mockedAxios.get.mockResolvedValue({ data: { status: 'success' } });

            const result = await signInService({ mobile: mockStudent.mobile });

            expect(result).toHaveProperty('message', 'OTP sent successfully');
            expect(result.student).toHaveProperty('id', mockStudent.id);
            expect(result.student).toHaveProperty('name', mockStudent.name);
            expect(result.student).toHaveProperty('mobile', mockStudent.mobile);
            expect(result.student).toHaveProperty('email', mockStudent.email);
            expect(result.student).toHaveProperty('status', mockStudent.status);
        });

        it('should throw error for invalid mobile number', async () => {
            (repo.findUserByMobile as jest.Mock).mockResolvedValue(null);

            await expect(signInService({ mobile: '1234567890' })).rejects.toThrow(
                new CustomError('Invalid mobile number', 401)
            );
        });
    });
});
