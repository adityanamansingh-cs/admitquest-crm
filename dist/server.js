"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./config"); // Load environment variables first
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const database_1 = require("./database");
const config_1 = require("./config");
const error_handler_1 = require("./utils/error-handler");
const swagger_1 = require("./utils/swagger");
const appServer = (0, express_1.default)();
const port = config_1.PORT;
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
appServer.use((req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
        if (res.statusCode >= 500) {
            logger_1.default.error(message);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn(message);
        }
        else {
            logger_1.default.info(message);
        }
    });
    next();
});
// Enable CORS
appServer.use((0, cors_1.default)(corsOptions));
appServer.options('*', (0, cors_1.default)(corsOptions));
// Middleware for parsing JSON and URL-encoded bodies
appServer.use(express_1.default.json());
appServer.use(express_1.default.urlencoded({ extended: true }));
appServer.use('/api-docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
// Use the router with the /api prefix
appServer.use('/api', routes_1.default);
appServer.use(error_handler_1.errorHandler);
appServer.all('*', (req, res) => {
    res.status(404).json({ message: 'Sorry! Page not found' });
});
database_1.DB.sequelize
    .authenticate()
    .then(() => {
    logger_1.default.info('Database connected successfully!');
    appServer.listen(port, () => {
        logger_1.default.info(`Server is running on http://localhost:${port}`);
    });
})
    .catch(error => {
    logger_1.default.error('Unable to connect to the database:', error);
});
