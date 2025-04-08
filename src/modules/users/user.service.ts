import { DB } from '@/database';
import { CustomError } from '@/utils/custom-error';
import logger from '@/utils/logger';
import bcrypt from 'bcrypt';

export const createUser = async (userData: {
    email: string;
    name: string;
    password: string;
    role?: 'admin' | 'user';
}) => {
    try {
        // Check if user already exists
        const existingUser = await DB.Users.findOne({
            where: { email: userData.email }
        });

        if (existingUser) {
            throw new CustomError('User with this email already exists', 409);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Create the user
        const newUser = await DB.Users.create({
            ...userData,
            password: hashedPassword,
            role: userData.role || 'user'
        });

        // Return user data without password
        return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            created_at: newUser.created_at
        };
    } catch (error) {
        logger.error('Error in createUser:', { error, userData: { ...userData, password: 'REDACTED' } });
        if (error instanceof CustomError) {
            throw error;
        }
        throw new CustomError('Failed to create user', 500);
    }
}; 