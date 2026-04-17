const ApiError = require('../utils/ApiError');

// ──────────────────────────────────────────────
// Global Error Handling Middleware
//
// This middleware catches ALL errors thrown in the
// application — both intentional ApiErrors and
// unexpected runtime errors — and returns a
// consistent JSON response.
//
// In development: includes stack trace for debugging
// In production: hides internal details for security
// ──────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Default to 500 if no status code was set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error for server-side debugging
  console.error(`❌ [${req.method}] ${req.originalUrl} → ${statusCode}: ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
