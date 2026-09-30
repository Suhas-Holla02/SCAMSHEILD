import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load .env variables manually without external dependency
function loadEnv() {
  const envPath = path.resolve(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex !== -1) {
        const key = trimmed.slice(0, eqIndex).trim();
        const value = trimmed.slice(eqIndex + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

async function testConnection() {
  console.log('--------------------------------------------------');
  console.log('🔍 Testing Aiven MySQL Database Connection...');
  console.log('--------------------------------------------------');

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL } = process.env;

  console.log(`DB_HOST:     ${DB_HOST ? DB_HOST : '(empty)'}`);
  console.log(`DB_PORT:     ${DB_PORT || '3306'}`);
  console.log(`DB_USER:     ${DB_USER ? DB_USER : '(empty)'}`);
  console.log(`DB_NAME:     ${DB_NAME ? DB_NAME : '(empty)'}`);
  console.log(`DB_PASSWORD: ${DB_PASSWORD ? '********' : '(empty)'}`);
  console.log('--------------------------------------------------');

  if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
    console.error('❌ Missing credentials in .env file!');
    console.error('Please open .env and fill in:');
    console.error('  - DB_HOST');
    console.error('  - DB_PORT');
    console.error('  - DB_USER');
    console.error('  - DB_PASSWORD');
    console.error('  - DB_NAME');
    process.exit(1);
  }

  const config = {
    host: DB_HOST,
    port: parseInt(DB_PORT || '3306', 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0
  };

  // Cloud databases (such as Aiven) require SSL
  if (
    DB_SSL === 'true' ||
    (DB_HOST && !DB_HOST.includes('localhost') && !DB_HOST.includes('127.0.0.1'))
  ) {
    config.ssl = { rejectUnauthorized: false };
    console.log('🔒 SSL/TLS encryption enabled for Aiven MySQL');
  }

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to Aiven MySQL server!');

    // Ping check
    const [ping] = await connection.execute('SELECT 1 + 1 AS connection_test');
    console.log(`✅ Query test passed: 1 + 1 = ${ping[0].connection_test}`);

    // Create the required analyses table if it does not exist
    console.log('📦 Ensuring required table "analyses" exists...');
    await connection.execute(`
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

    const [tables] = await connection.execute("SHOW TABLES LIKE 'analyses'");
    if (tables.length > 0) {
      console.log('✅ Table "analyses" is verified and ready in the database!');
    }

    console.log('--------------------------------------------------');
    console.log('🎉 ALL DATABASE CHECKS PASSED SUCCESSFULLY!');
    console.log('--------------------------------------------------');
  } catch (error) {
    console.error('\n❌ Database Connection Failed!');
    console.error('Error Code:   ', error.code);
    console.error('Error Message:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Check if DB_HOST and DB_PORT are copied correctly from Aiven console.');
    console.error('2. Ensure DB_USER (e.g. avnadmin) and DB_PASSWORD are correct.');
    console.error('3. Make sure your Aiven MySQL service state is "RUNNING" (green).');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
