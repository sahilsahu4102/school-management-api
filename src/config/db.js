const mysql = require('mysql2/promise');
require('dotenv').config();

// ──────────────────────────────────────────────
// MySQL Connection Pool
// Using a pool instead of a single connection for:
//   - Better performance under concurrent requests
//   - Automatic connection management
//   - Resilience against dropped connections
// ──────────────────────────────────────────────

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// ──────────────────────────────────────────────
// Auto-create schools table on startup
// This ensures the app is self-bootstrapping —
// no manual SQL scripts needed.
// ──────────────────────────────────────────────

const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(500) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    await pool.execute(createTableQuery);
    console.log('✅ Database initialized — schools table ready');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    throw error;
  }
};

// ──────────────────────────────────────────────
// Test database connectivity
// ──────────────────────────────────────────────

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    throw error;
  }
};

module.exports = { pool, initializeDatabase, testConnection };
