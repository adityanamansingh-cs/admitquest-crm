"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_DIALECT = exports.DB_HOST = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USERNAME = exports.DB_PORT = exports.API_URL = exports.JWT_ACCESS_TOKEN_SECRET = exports.BASE_URL = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
(0, dotenv_1.config)({ path: envFile });
_a = process.env, exports.PORT = _a.PORT, exports.NODE_ENV = _a.NODE_ENV, exports.BASE_URL = _a.BASE_URL, exports.JWT_ACCESS_TOKEN_SECRET = _a.JWT_ACCESS_TOKEN_SECRET, exports.API_URL = _a.API_URL;
_b = process.env, exports.DB_PORT = _b.DB_PORT, exports.DB_USERNAME = _b.DB_USERNAME, exports.DB_PASSWORD = _b.DB_PASSWORD, exports.DB_NAME = _b.DB_NAME, exports.DB_HOST = _b.DB_HOST, exports.DB_DIALECT = _b.DB_DIALECT;
