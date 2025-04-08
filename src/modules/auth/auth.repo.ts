import { DB } from '@/database';
import { StudentModel } from '@/database/models/student.model';
import { CustomError } from '@/utils/custom-error';
import logger from '@/utils/logger';

const repo = {
    findUserByMobile: async (mobile: string): Promise<StudentModel | null> => {
        try {
            return await DB.Student.findOne({
                where: { mobile },
            });
        } catch (error) {
            logger.error('Error in findUserByMobile:', { error, mobile });
            throw new CustomError('Failed to find user by mobile', 500);
        }
    },

    createUser: async (userData: any): Promise<StudentModel> => {
        try {
            return await DB.Student.create(userData);
        } catch (error) {
            logger.error('Error in createUser:', { error, userData });
            throw new CustomError('Failed to create user', 500);
        }
    },

    updateStudentOTP: async (mobile: string, otp: string): Promise<StudentModel> => {
        try {
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

            const [updatedCount, updatedUsers] = await DB.Student.update(
                { 
                    otp,
                    otp_expiry: otpExpiry 
                },
                {
                    where: { mobile },
                    returning: true,
                },
            );

            if (updatedCount === 0) {
                logger.warn('No user found to update OTP:', { mobile });
                throw new CustomError('User not found', 404);
            }

            return updatedUsers[0];
        } catch (error) {
            logger.error('Error in updateStudentOTP:', { error, mobile });
            throw new CustomError('Failed to update OTP', 500);
        }
    },
};

export default repo;
