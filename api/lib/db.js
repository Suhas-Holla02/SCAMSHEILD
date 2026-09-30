import mysql from 'mysql2/promise';

let pool = null;

export function isDbConfigured() {
  return Boolean(
    process.env.DB_HOST &&
    process.env.DB_USER &&
    process.env.DB_NAME &&
    process.env.DB_HOST.trim() !== '' &&
    process.env.DB_USER.trim() !== '' &&
    process.env.DB_NAME.trim() !== ''
  );
}

export function getPool() {
  if (!isDbConfigured()) {
    throw new Error('Database is not configured (DB_HOST, DB_USER, or DB_NAME is missing)');
  }

  if (!pool) {
    const config = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };

    // Aiven and other cloud MySQL providers require SSL/TLS
    if (
      process.env.DB_SSL === 'true' ||
      (process.env.DB_HOST &&
        !process.env.DB_HOST.includes('localhost') &&
        !process.env.DB_HOST.includes('127.0.0.1'))
    ) {
      config.ssl = {
        rejectUnauthorized: false
      };
    }

    pool = mysql.createPool(config);
  }
  return pool;
}

export async function query(sql, params = []) {
  const poolInstance = getPool();
  const [rows] = await poolInstance.execute(sql, params);
  return rows;
}

export async function initDatabase() {
  if (!isDbConfigured()) {
    return false;
  }

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS analyses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('text', 'screenshot', 'url') NOT NULL DEFAULT 'text',
        input_preview VARCHAR(500),
        risk_level ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'low',
        risk_score INT NOT NULL DEFAULT 0,
        scam_type VARCHAR(100),
        result_json TEXT,
        session_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_session_id (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    return true;
  } catch (error) {
    console.error('Database init error:', error.message);
    return false;
  }
}
