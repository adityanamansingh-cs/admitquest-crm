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
exports.verifyJWT = exports.generateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateJWT = (payload, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = `Bearer ${jsonwebtoken_1.default.sign(payload, secretKey, {
            expiresIn: '2d',
        })}`;
        return token;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.generateJWT = generateJWT;
const verifyJWT = (token, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cleanedToken = token.replace('Bearer ', '');
        const data = jsonwebtoken_1.default.verify(cleanedToken, secretKey);
        if (typeof data === 'string') {
            throw new Error('Invalid token payload');
        }
        return data;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.verifyJWT = verifyJWT;
