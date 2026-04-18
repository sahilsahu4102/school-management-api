const swaggerJsdoc = require('swagger-jsdoc');

// ──────────────────────────────────────────────
// Swagger / OpenAPI 3.0 Configuration
//
// Auto-generates interactive API documentation
// from JSDoc annotations in the route files.
// Accessible at /api-docs when the server runs.
// ──────────────────────────────────────────────

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
      description:
        'A production-grade REST API for managing schools. Add schools and find nearby schools sorted by proximity using the Haversine formula.',
      contact: {
        name: 'Sahil',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.BASE_URL || '/' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description:
          process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
    tags: [
      {
        name: 'Schools',
        description: 'School management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
