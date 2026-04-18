const { pool } = require('../config/db');

// ──────────────────────────────────────────────
// School Model
//
// All database queries are isolated here.
// Uses prepared statements to prevent SQL injection.
// ──────────────────────────────────────────────

/**
 * Insert a new school into the database.
 *
 * @param {Object} schoolData
 * @param {string} schoolData.name
 * @param {string} schoolData.address
 * @param {number} schoolData.latitude
 * @param {number} schoolData.longitude
 * @returns {Object} The created school with its generated ID
 */
const createSchool = async ({ name, address, latitude, longitude }) => {
  const query = `
    INSERT INTO schools (name, address, latitude, longitude) 
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.execute(query, [name, address, latitude, longitude]);

  return {
    id: result.insertId,
    name,
    address,
    latitude,
    longitude,
  };
};

/**
 * Fetch all schools from the database.
 *
 * @returns {Array} Array of school objects
 */
const getAllSchools = async () => {
  const query = `SELECT id, name, address, latitude, longitude FROM schools ORDER BY id`;
  const [rows] = await pool.execute(query);
  return rows;
};

module.exports = { createSchool, getAllSchools };
