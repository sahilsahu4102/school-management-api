// ──────────────────────────────────────────────
// Standardized API Response Wrapper
// Every successful response from this API follows
// the same envelope format for consistency.
// ──────────────────────────────────────────────

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Human-readable success message
   * @param {*} data - Response payload
   */
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
