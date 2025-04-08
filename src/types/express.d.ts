import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      context?: JwtPayload;
    }
  }
} 