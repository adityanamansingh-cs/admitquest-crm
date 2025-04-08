import { API_URL } from '@/config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
const swaggerSpec = swaggerJSDoc({
    ...options,
    swaggerDefinition: {
        ...options.swaggerDefinition,
        // Ensure paths are properly merged
        paths: {},
    },
});

export { swaggerUi, swaggerSpec };
