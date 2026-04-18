const ApiError = require('../utils/ApiError');

// ──────────────────────────────────────────────
// Joi Validation Middleware Factory
//
// Returns a middleware function that validates
// req[source] (body, query, or params) against
// a Joi schema. On failure, returns a clean 400
// error with field-level details.
//
// Usage:
//   router.post('/addSchool', validate(addSchoolSchema), controller);
//   router.get('/listSchools', validate(listSchoolsSchema, 'query'), controller);
// ──────────────────────────────────────────────

/**
 * @param {import('joi').ObjectSchema} schema - Joi validation schema
 * @param {'body' | 'query' | 'params'} source - Where to read data from
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Report ALL errors, not just the first one
      stripUnknown: true, // Remove fields not defined in schema
    });

    if (error) {
      // Build a human-readable array of field-level errors
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, ''),
      }));

      throw new ApiError(400, 'Validation failed', errorDetails);
    }

    // Replace the source with the validated (and sanitized) value
    req[source] = value;
    next();
  };
};

module.exports = validate;
