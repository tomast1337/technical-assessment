import { Options } from 'swagger-jsdoc';

export const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        refreshToken: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refresh-token',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        refreshToken: [],
      },
    ],
  },
  apis: ['./src/controllers/*.ts'],
};
