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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOTPService = exports.refreshTokenService = exports.signInService = exports.verifyOTPService = exports.signUpService = void 0;
const auth_validator_1 = require("./auth.validator");
const auth_repo_1 = __importDefault(require("./auth.repo"));
const jwt_service_1 = require("../../middlewares/jwt.service");
const config_1 = require("../../config");
const custom_error_1 = require("../../utils/custom-error");
const axios_1 = __importDefault(require("axios"));
const signUpService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { error } = (0, auth_validator_1.validateSignUp)(userData);
        if (error) {
            throw new custom_error_1.CustomError(`Validation error: ${error.details[0].message} (Field: ${error.details[0].path.join('.')})`, 400);
        }
        const findUser = yield auth_repo_1.default.findUserByMobile(userData.mobile);
        if (findUser) {
            throw new custom_error_1.CustomError(`Mobile number ${userData.mobile} already exists`, 409);
        }
        // Insert student data into database with active status
        const studentData = Object.assign(Object.assign({}, userData), { status: 'active', is_mobile_verified: false, is_email_verified: false, email: userData.email });
        const newStudent = yield auth_repo_1.default.createUser(studentData);
        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        yield auth_repo_1.default.updateStudentOTP(userData.mobile, otp, otpExpiry);
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
            const response = yield axios_1.default.get(smsApiUrl, { params });
        }
        catch (smsError) {
            console.error('Failed to send OTP via SMS:', ((_a = smsError.response) === null || _a === void 0 ? void 0 : _a.data) || smsError.message);
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
    }
    catch (error) {
        console.error('Error in signUpService:', {
            error,
            stack: error === null || error === void 0 ? void 0 : error.stack,
            userData: Object.assign(Object.assign({}, userData), { email: userData.email ? 'REDACTED' : undefined }),
        });
        if (error instanceof custom_error_1.CustomError) {
            throw error;
        }
        throw new custom_error_1.CustomError(`Failed to sign up: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`, 500);
    }
});
exports.signUpService = signUpService;
const verifyOTPService = (mobile, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, auth_validator_1.validateVerifyOTP)({ mobile, otp });
    if (error) {
        throw new custom_error_1.CustomError(error.details[0].message, 400);
    }
    const student = yield auth_repo_1.default.findUserByMobile(mobile);
    if (!student) {
        throw new custom_error_1.CustomError('Invalid mobile number', 401);
    }
    if (student.otp !== otp) {
        throw new custom_error_1.CustomError('Invalid OTP', 401);
    }
    if (student.otp_expiry && student.otp_expiry < new Date()) {
        throw new custom_error_1.CustomError('OTP has expired', 401);
    }
    // Update mobile verification status
    student.is_mobile_verified = true;
    yield student.save();
    const payload = {
        userId: student.id,
    };
    const accessToken = yield (0, jwt_service_1.generateJWT)(payload, config_1.JWT_ACCESS_TOKEN_SECRET);
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
});
exports.verifyOTPService = verifyOTPService;
const signInService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //validateSignIn function is missing
    const { error } = (0, auth_validator_1.validateSignIn)(userData);
    if (error) {
        throw new custom_error_1.CustomError(error.details[0].message, 400);
    }
    const user = yield auth_repo_1.default.findUserByMobile(userData.mobile);
    if (!user) {
        throw new custom_error_1.CustomError('Invalid mobile number', 401);
    }
    //send OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
    yield auth_repo_1.default.updateStudentOTP(userData.mobile, otp, otpExpiry);
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
        const response = yield axios_1.default.get(smsApiUrl, { params });
    }
    catch (smsError) {
        console.error('Failed to send OTP via SMS:', ((_a = smsError.response) === null || _a === void 0 ? void 0 : _a.data) || smsError.message);
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
});
exports.signInService = signInService;
const refreshTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, auth_validator_1.validateRefreshToken)({ refreshToken });
    if (error) {
        throw new custom_error_1.CustomError(error.details[0].message, 400);
    }
    //verify the refresh token
    const payload = yield (0, jwt_service_1.verifyJWT)(refreshToken, config_1.JWT_ACCESS_TOKEN_SECRET);
    if (!payload) {
        throw new custom_error_1.CustomError('Invalid refresh token', 401);
    }
    //generate new access token
    const accessToken = yield (0, jwt_service_1.generateJWT)(payload, config_1.JWT_ACCESS_TOKEN_SECRET);
    return { accessToken };
});
exports.refreshTokenService = refreshTokenService;
const resendOTPService = (mobile) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { error } = (0, auth_validator_1.validateResendOTP)({ mobile });
    if (error) {
        throw new custom_error_1.CustomError(error.details[0].message, 400);
    }
    const user = yield auth_repo_1.default.findUserByMobile(mobile);
    if (!user) {
        throw new custom_error_1.CustomError('Invalid mobile number', 401);
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
            throw new custom_error_1.CustomError(`Please wait ${timeLeft} seconds before requesting a new OTP`, 429);
        }
    }
    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
    yield auth_repo_1.default.updateStudentOTP(mobile, otp, otpExpiry);
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
        const response = yield axios_1.default.get(smsApiUrl, { params });
    }
    catch (smsError) {
        console.error('Failed to send OTP via SMS:', ((_a = smsError.response) === null || _a === void 0 ? void 0 : _a.data) || smsError.message);
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
});
exports.resendOTPService = resendOTPService;
