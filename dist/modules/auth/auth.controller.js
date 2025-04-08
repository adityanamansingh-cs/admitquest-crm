"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTPController = exports.signInController = exports.signUpController = void 0;
const auth_service_1 = require("./auth.service");
const signUpController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // check the url is /signup or /verify-otp
    if (req.url === '/signup') {
        try {
            const userData = req.body;
            const response = yield (0, auth_service_1.signUpService)(userData);
            res.status(201).json({
                message: 'Successfully signed up',
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    else if (req.url === '/verify-otp') {
        try {
            const { mobile, otp } = req.body;
            const response = yield (0, auth_service_1.verifyOTPService)(mobile, otp);
            res.status(200).json({
                message: 'OTP verified successfully',
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
});
exports.signUpController = signUpController;
const signInController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.url === '/refresh-token') {
        // get the refresh token from the request body and send it to the service
        try {
            const refreshToken = req.body.refreshToken;
            const response = yield (0, auth_service_1.refreshTokenService)(refreshToken);
            res.status(200).json({
                message: 'Successfully refreshed token',
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
    else {
        try {
            const userData = req.body;
            const response = yield (0, auth_service_1.signInService)(userData);
            res.status(200).json({
                message: 'Successfully signed in',
                data: response,
            });
        }
        catch (error) {
            next(error);
        }
    }
});
exports.signInController = signInController;
const resendOTPController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobile } = req.body;
        const response = yield (0, auth_service_1.resendOTPService)(mobile);
        res.status(200).json({
            message: 'OTP resent successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendOTPController = resendOTPController;
