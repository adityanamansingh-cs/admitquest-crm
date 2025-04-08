import express from 'express';
import { 
    signInController, 
    signUpController, 
    verifyOTPController,
    refreshTokenController,
    resendOTPController 
} from './auth.controller';

const authRouter = express.Router();

authRouter.post('/signup', signUpController);
authRouter.post('/otp/verify', verifyOTPController);
authRouter.post('/signin', signInController);
authRouter.post('/refresh-token', refreshTokenController);
authRouter.post('/otp/resend', resendOTPController);

export default authRouter;
