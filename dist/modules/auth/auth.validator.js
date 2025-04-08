"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResendOTP = exports.validateRefreshToken = exports.validateVerifyOTP = exports.validateSignIn = exports.validateSignUp = void 0;
const joi_1 = __importDefault(require("joi"));
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    abortEarly: false,
};
const validateSignUp = (userData) => {
    const schema = joi_1.default.object({
        id: joi_1.default.number()
            .integer()
            .positive()
            .optional()
            .messages({ 'number.base': 'ID must be a number' }),
        name: joi_1.default.string().min(1).max(255).optional().messages({
            'string.min': 'Name should be at least 1 character',
            'string.max': 'Name should not exceed 255 characters',
        }),
        mobile: joi_1.default.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
            'string.pattern.base': 'Mobile number must start with 9-6 and be followed by 9 more digits',
            'any.required': 'Mobile number is required',
        }),
        email: joi_1.default.string().email().max(255).optional().messages({
            'string.email': 'Email format is invalid',
            'string.max': 'Email should not exceed 255 characters',
        }),
        course_id: joi_1.default.number().optional(),
        ip_address: joi_1.default.string().max(45).optional(),
        lead_utm_campaign: joi_1.default.string().max(255).optional(),
        lead_utm_source: joi_1.default.string().max(255).optional(),
        lead_utm_medium: joi_1.default.string().max(255).optional(),
        admitted_institute_id: joi_1.default.number().optional(),
        image: joi_1.default.string().max(255).optional(),
        status: joi_1.default.string().valid('active', 'inactive').default('active'),
    });
    const result = schema.validate(userData, options);
    if (result.error) {
        console.error('Validation errors:', result.error.details.map(err => {
            var _a;
            return ({
                field: err.path.join('.'),
                message: err.message,
                value: (_a = err.context) === null || _a === void 0 ? void 0 : _a.value,
            });
        }));
    }
    return result;
};
exports.validateSignUp = validateSignUp;
const validateSignIn = (userData) => {
    const schema = joi_1.default.object({
        mobile: joi_1.default.string()
            .pattern(/^[6-9]\d{9}$/)
            .required(),
    });
    return schema.validate(userData, options);
};
exports.validateSignIn = validateSignIn;
const validateVerifyOTP = (data) => {
    console.log('Validating OTP data:', {
        mobile: data.mobile,
        otp: '******',
    });
    const schema = joi_1.default.object({
        mobile: joi_1.default.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
            'string.pattern.base': 'Mobile number must start with 9-6 and be followed by 9 more digits',
            'any.required': 'Mobile number is required',
        }),
        otp: joi_1.default.string().length(4).required().messages({
            'string.length': 'OTP must be 4 digits',
            'any.required': 'OTP is required',
        }),
    });
    const result = schema.validate(data, options);
    if (result.error) {
        console.error('OTP Validation errors:', result.error.details.map(err => {
            var _a;
            return ({
                field: err.path.join('.'),
                message: err.message,
                value: (_a = err.context) === null || _a === void 0 ? void 0 : _a.value,
            });
        }));
    }
    return result;
};
exports.validateVerifyOTP = validateVerifyOTP;
//validateRefreshToken
const validateRefreshToken = (data) => {
    const schema = joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    });
    return schema.validate(data, options);
};
exports.validateRefreshToken = validateRefreshToken;
const validateResendOTP = (data) => {
    const schema = joi_1.default.object({
        mobile: joi_1.default.string()
            .pattern(/^[6-9]\d{9}$/)
            .required()
            .messages({
            'string.pattern.base': 'Mobile number must start with 9-6 and be followed by 9 more digits',
            'any.required': 'Mobile number is required',
        }),
    });
    return schema.validate(data, options);
};
exports.validateResendOTP = validateResendOTP;
