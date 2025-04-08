"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
exports.swaggerUi = swagger_ui_express_1.default;
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AdmitQuest.ai API',
            version: '1.0.0',
            description: 'API documentation for AdmitQuest.ai',
        },
        servers: [
            {
                url: 'http://localhost:8100/api',
                description: 'Local development server',
            },
            {
                url: 'https://dev-api.admitquest.ai/api',
                description: 'Development server',
            },
            {
                url: 'https://staging-api.admitquest.ai/api',
                description: 'Staging server',
            },
            {
                url: 'https://api.admitquest.ai/api',
                description: 'Production server',
            },
            {
                url: 'http://{custom-server}',
                description: 'Custom server',
                variables: {
                    'custom-server': {
                        default: 'api.admitquest.ai',
                        description: 'Custom server address',
                    },
                },
            },
            {
                url: 'https://{custom-servers}',
                description: 'Custom server HTTPS',
                variables: {
                    'custom-servers': {
                        default: 'api.admitquest.ai',
                        description: 'Custom server address',
                    },
                },
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/docs/*.yaml', './src/docs/schema/*.yaml'],
};
// Add options to ensure all files are properly loaded
const swaggerSpec = (0, swagger_jsdoc_1.default)(Object.assign(Object.assign({}, options), { swaggerDefinition: Object.assign(Object.assign({}, options.swaggerDefinition), { 
        // Ensure paths are properly merged
        paths: {} }) }));
exports.swaggerSpec = swaggerSpec;
