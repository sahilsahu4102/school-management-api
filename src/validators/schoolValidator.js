const Joi = require('joi');

// ──────────────────────────────────────────────
// Validation Schemas
//
// Using Joi for robust, declarative validation.
// Each schema defines exact rules with custom
// error messages for a professional API experience.
// ──────────────────────────────────────────────

/**
 * Schema for POST /addSchool
 * Validates the request body.
 */
const addSchoolSchema = Joi.object({
  name: Joi.string().trim().min(3).max(255).required().messages({
    'string.base': 'School name must be a string',
    'string.empty': 'School name cannot be empty',
    'string.min': 'School name must be at least 3 characters',
    'string.max': 'School name cannot exceed 255 characters',
    'any.required': 'School name is required',
  }),

  address: Joi.string().trim().min(5).max(500).required().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address cannot be empty',
    'string.min': 'Address must be at least 5 characters',
    'string.max': 'Address cannot exceed 500 characters',
    'any.required': 'Address is required',
  }),

  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a valid number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required',
  }),

  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a valid number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required',
  }),
});

/**
 * Schema for GET /listSchools
 * Validates query parameters.
 */
const listSchoolsSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.base': 'Latitude must be a valid number',
    'number.min': 'Latitude must be between -90 and 90',
    'number.max': 'Latitude must be between -90 and 90',
    'any.required': 'Latitude is required — pass it as a query parameter',
  }),

  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.base': 'Longitude must be a valid number',
    'number.min': 'Longitude must be between -180 and 180',
    'number.max': 'Longitude must be between -180 and 180',
    'any.required': 'Longitude is required — pass it as a query parameter',
  }),
});

module.exports = { addSchoolSchema, listSchoolsSchema };
