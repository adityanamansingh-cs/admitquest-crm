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
exports.authMiddleware = void 0;
const custom_error_1 = require("../utils/custom-error");
const jwt_service_1 = require("./jwt.service");
const config_1 = require("../config");
const decodeToken = (header) => __awaiter(void 0, void 0, void 0, function* () {
    if (!header) {
        throw new custom_error_1.CustomError('Authorization header missing', 401);
    }
    const token = header.replace('Bearer ', '');
    try {
        const payload = yield (0, jwt_service_1.verifyJWT)(token, config_1.JWT_ACCESS_TOKEN_SECRET);
        return payload;
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new custom_error_1.CustomError('Token has expired', 401);
        }
        throw new custom_error_1.CustomError('Invalid token', 401);
    }
});
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { method, path } = req;
    if (method === 'OPTIONS' ||
        ['/api/auth/signin', '/api/auth/refresh-token'].includes(path)) {
        return next();
    }
    try {
        const authHeader = req.header('Authorization') || req.header('authorization');
        req.context = yield decodeToken(authHeader);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.authMiddleware = authMiddleware;
