"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
require("winston-daily-rotate-file");
const path_1 = __importDefault(require("path"));
// Folder paths for logs
const logDir = path_1.default.join(__dirname, '../logs');
const logFormatter = winston_1.default.format.printf(info => {
    const { timestamp, level, stack, message } = info;
    const errorMessage = stack || message;
    const symbols = Object.getOwnPropertySymbols(info);
    if (info[symbols[0]] !== 'error') {
        return `[${timestamp}] - ${level}: ${message}`;
    }
    return `[${timestamp}] ${level}: ${errorMessage}`;
});
// Daily Rotate File for debug logs
const debugTransport = new winston_1.default.transports.DailyRotateFile({
    filename: `${logDir}/debug/debug-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level: 'debug',
    maxFiles: '14d', // Keep logs for 14 days
});
// Daily Rotate File for error logs
const errorTransport = new winston_1.default.transports.DailyRotateFile({
    filename: `${logDir}/error/error-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxFiles: '30d', // Keep error logs for 30 days
});
// Console transport for development
const consoleTransport = new winston_1.default.transports.Console({
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), logFormatter),
});
// Winston Logger Configuration
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })),
    transports: [consoleTransport, debugTransport, errorTransport],
});
exports.default = logger;
