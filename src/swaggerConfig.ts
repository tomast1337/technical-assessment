import { Options } from 'swagger-jsdoc';

export const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/*.ts'], // Adjust the paths as necessary
};
