"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const custom_error_1 = require("./custom-error");
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof custom_error_1.CustomError ? err.statusCode : 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({ error: message });
};
exports.errorHandler = errorHandler;
