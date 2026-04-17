// ──────────────────────────────────────────────
// Custom API Error Class
// Extends native Error with HTTP status codes
// and structured error details for consistent
// error responses across the API.
// ──────────────────────────────────────────────

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Optional array of field-level errors
   */
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    // Capture stack trace for debugging (excludes constructor call)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
