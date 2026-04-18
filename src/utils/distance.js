// ──────────────────────────────────────────────
// Haversine Distance Calculator
//
// Calculates the great-circle distance between
// two points on Earth's surface given their
// latitude and longitude in decimal degrees.
//
// This is the same formula used by Google Maps
// and is accurate for any two points on Earth,
// unlike Euclidean distance which fails on a sphere.
//
// Reference: https://en.wikipedia.org/wiki/Haversine_formula
// ──────────────────────────────────────────────

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate the distance between two geographic points
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of point 1 (in decimal degrees)
 * @param {number} lon1 - Longitude of point 1 (in decimal degrees)
 * @param {number} lat2 - Latitude of point 2 (in decimal degrees)
 * @param {number} lon2 - Longitude of point 2 (in decimal degrees)
 * @returns {number} Distance in kilometers (rounded to 2 decimal places)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's mean radius in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

module.exports = { calculateDistance };
