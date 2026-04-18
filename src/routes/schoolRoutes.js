const express = require('express');
const router = express.Router();

const { addSchool, listSchools } = require('../controllers/schoolController');
const validate = require('../middleware/validate');
const { addSchoolSchema, listSchoolsSchema } = require('../validators/schoolValidator');

// ──────────────────────────────────────────────
// School Routes
// ──────────────────────────────────────────────

/**
 * @swagger
 * /api/addSchool:
 *   post:
 *     summary: Add a new school
 *     description: Validates the input data and adds a new school to the database.
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: Delhi Public School
 *                 description: Name of the school (3-255 characters)
 *               address:
 *                 type: string
 *                 example: Mathura Road, New Delhi, 110003
 *                 description: Full address of the school (5-500 characters)
 *               latitude:
 *                 type: number
 *                 example: 28.5839
 *                 description: Latitude coordinate (-90 to 90)
 *               longitude:
 *                 type: number
 *                 example: 77.2410
 *                 description: Longitude coordinate (-180 to 180)
 *     responses:
 *       201:
 *         description: School added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: School added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                     address:
 *                       type: string
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *       400:
 *         description: Validation error
 */
router.post('/addSchool', validate(addSchoolSchema, 'body'), addSchool);

/**
 * @swagger
 * /api/listSchools:
 *   get:
 *     summary: List schools sorted by proximity
 *     description: Fetches all schools from the database, calculates the distance from the user's location using the Haversine formula, and returns them sorted by proximity (nearest first).
 *     tags: [Schools]
 *     parameters:
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 28.6139
 *         description: User's latitude coordinate
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           example: 77.2090
 *         description: User's longitude coordinate
 *     responses:
 *       200:
 *         description: List of schools sorted by proximity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Schools retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       address:
 *                         type: string
 *                       latitude:
 *                         type: number
 *                       longitude:
 *                         type: number
 *                       distance_km:
 *                         type: number
 *                         description: Distance from user location in kilometers
 *                 count:
 *                   type: integer
 *                   description: Total number of schools
 *       400:
 *         description: Validation error — missing or invalid coordinates
 */
router.get('/listSchools', validate(listSchoolsSchema, 'query'), listSchools);

module.exports = router;
