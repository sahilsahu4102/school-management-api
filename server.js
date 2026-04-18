require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const schoolRoutes = require('./src/routes/schoolRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const swaggerSpec = require('./swagger');
const { initializeDatabase, testConnection } = require('./src/config/db');

// ──────────────────────────────────────────────
// Initialize Express App
// ──────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────────────────────────
// Global Middleware Stack
// ──────────────────────────────────────────────

// Security headers (XSS protection, content-type sniffing, etc.)
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for Swagger UI to load properly
  })
);

// CORS — allow requests from any origin (required for Postman & frontend testing)
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' })); // Limit body size for security

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Rate limiting — prevent abuse (100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use(limiter);

// ──────────────────────────────────────────────
// API Documentation (Swagger UI)
// ──────────────────────────────────────────────

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'School Management API Docs',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Health check endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🏫 School Management API is running',
    documentation: '/api-docs',
    endpoints: {
      addSchool: 'POST /api/addSchool',
      listSchools: 'GET /api/listSchools?latitude=28.6139&longitude=77.2090',
    },
  });
});

// Mount school routes under /api prefix
app.use('/api', schoolRoutes);

// Also mount at root level (as per assignment spec: /addSchool, /listSchools)
app.use('/', schoolRoutes);

// ──────────────────────────────────────────────
// 404 Handler — Catch undefined routes
// ──────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found. Visit /api-docs for available endpoints.',
  });
});

// ──────────────────────────────────────────────
// Global Error Handler (must be last middleware)
// ──────────────────────────────────────────────

app.use(errorHandler);

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────

const startServer = async () => {
  try {
    // 1. Test database connection
    await testConnection();

    // 2. Initialize database (create tables if needed)
    await initializeDatabase();

    // 3. Start listening
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('💀 Failed to start server:', error.message);
    process.exit(1);
  }
};

// ──────────────────────────────────────────────
// Graceful Shutdown
// ──────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received — shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received — shutting down gracefully...');
  process.exit(0);
});

// Launch!
startServer();

module.exports = app;
