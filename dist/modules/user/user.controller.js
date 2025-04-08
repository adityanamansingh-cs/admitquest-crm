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
exports.updateUserController = exports.createApplicationController = exports.getCartController = exports.getApplicationController = exports.getUserProfileController = void 0;
const jwt_service_1 = require("../../middlewares/jwt.service");
const config_1 = require("../../config");
const user_service_1 = require("./user.service");
const custom_error_1 = require("../../utils/custom-error");
const getUserProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const accessToken = authorization.split(' ')[1];
        const response = yield (0, user_service_1.getUserProfileService)(accessToken);
        res.status(200).json({ message: 'User data fetched', data: response });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserProfileController = getUserProfileController;
const getApplicationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'Application not found' });
            return;
        }
        const accessToken = authorization.split(' ')[1];
        const response = yield (0, user_service_1.getApplicationService)(accessToken);
        res.status(200).json({
            message: 'Application data fetched',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getApplicationController = getApplicationController;
const getCartController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }
        const accessToken = authorization.split(' ')[1];
        const response = yield (0, user_service_1.getCartService)(accessToken);
        res.status(200).json({ message: 'Cart data fetched', data: response });
    }
    catch (error) {
        next(error);
    }
});
exports.getCartController = getCartController;
const createApplicationController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorization = req.headers.authorization;
        if (!authorization) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const accessToken = authorization.split(' ')[1];
        const applicationData = req.body;
        const response = yield (0, user_service_1.createApplicationService)(accessToken, applicationData);
        res.status(201).json({
            message: 'Application created successfully',
            data: response,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.createApplicationController = createApplicationController;
const updateUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!accessToken) {
            throw new custom_error_1.CustomError('Access token is required', 401);
        }
        const payload = yield (0, jwt_service_1.verifyJWT)(accessToken, config_1.JWT_ACCESS_TOKEN_SECRET);
        if (!payload || !payload.userId) {
            throw new custom_error_1.CustomError('Invalid access token', 401);
        }
        const response = yield (0, user_service_1.updateUserService)(payload.userId, req.body);
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserController = updateUserController;
