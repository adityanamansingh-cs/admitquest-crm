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
exports.validateAndGetUser = exports.validateUpdateUser = void 0;
// user.validator.js
const joi_1 = __importDefault(require("joi"));
const jwt_service_1 = require("../../middlewares/jwt.service");
const config_1 = require("../../config");
const user_repo_1 = require("./user.repo");
const custom_error_1 = require("../../utils/custom-error");
const options = {
    errors: {
        wrap: {
            label: '',
        },
    },
    abortEarly: false,
};
const validateUpdateUser = (userData) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(1).max(255).optional().messages({
            'string.min': 'Name should be at least 1 character',
            'string.max': 'Name should not exceed 255 characters',
        }),
        email: joi_1.default.string().email().max(255).optional().messages({
            'string.email': 'Email format is invalid',
            'string.max': 'Email should not exceed 255 characters',
        }),
        course_id: joi_1.default.number().optional(),
        image: joi_1.default.string().max(255).optional(),
        mobile: joi_1.default.forbidden().messages({
            'any.unknown': 'Mobile number cannot be updated',
        }),
    });
    return schema.validate(userData, options);
};
exports.validateUpdateUser = validateUpdateUser;
const validateAndGetUser = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = yield (0, jwt_service_1.verifyJWT)(accessToken, config_1.JWT_ACCESS_TOKEN_SECRET);
    if (!(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
        throw new custom_error_1.CustomError('Invalid token', 401);
    }
    const user = yield user_repo_1.repo.getUserProfile(decoded.userId);
    if (!user) {
        throw new custom_error_1.CustomError('User not found', 404);
    }
    return {
        userId: decoded.userId,
        user,
    };
});
exports.validateAndGetUser = validateAndGetUser;
