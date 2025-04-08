import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_SECRET } from '../config';
import { User } from '../types/user.types';

export const generateToken = (user: User): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_ACCESS_TOKEN_SECRET as string);
}; 