const schoolModel = require('../models/schoolModel');
const { calculateDistance } = require('../utils/distance');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

// ──────────────────────────────────────────────
// School Controllers
//
// These are the route handlers. They orchestrate:
//   1. Calling the model (database layer)
//   2. Applying business logic (distance calculation)
//   3. Returning a standardized response
// ──────────────────────────────────────────────

/**
 * @desc    Add a new school to the database
 * @route   POST /api/addSchool
 * @access  Public
 */
const addSchool = async (req, res, next) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Create the school in the database
    const school = await schoolModel.createSchool({ name, address, latitude, longitude });

    // Return 201 Created with the new school data
    const response = new ApiResponse(201, 'School added successfully', school);
    res.status(201).json(response);
  } catch (error) {
    // Check for duplicate entry or other DB-specific errors
    if (error.code === 'ER_DUP_ENTRY') {
      return next(new ApiError(409, 'A school with this information already exists'));
    }
    next(error);
  }
};

/**
 * @desc    List all schools sorted by proximity to user's location
 * @route   GET /api/listSchools
 * @access  Public
 */
const listSchools = async (req, res, next) => {
  try {
    const { latitude: userLat, longitude: userLon } = req.query;

    // Fetch all schools from the database
    const schools = await schoolModel.getAllSchools();

    // Calculate distance for each school and sort by proximity
    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance_km: calculateDistance(
          parseFloat(userLat),
          parseFloat(userLon),
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    // Return sorted list
    const response = new ApiResponse(200, 'Schools retrieved successfully', schoolsWithDistance);
    res.status(200).json({
      ...response,
      count: schoolsWithDistance.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addSchool, listSchools };
