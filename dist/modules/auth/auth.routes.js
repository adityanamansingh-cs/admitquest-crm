"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const authRouter = express_1.default.Router();
authRouter.post('/signup', auth_controller_1.signUpController);
authRouter.post('/verify-otp', auth_controller_1.signUpController);
authRouter.post('/signin', auth_controller_1.signInController);
authRouter.post('/refresh-token', auth_controller_1.signInController);
authRouter.post('/resend-otp', auth_controller_1.resendOTPController);
exports.default = authRouter;
