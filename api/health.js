import { setCors } from './lib/cors.js';
import { query } from './lib/db.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;

  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      database: 'unknown',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'not configured'
    }
  };

  try {
    await query('SELECT 1');
    health.services.database = 'ok';
  } catch (error) {
    health.services.database = 'unavailable';
    health.status = 'degraded';
  }

  return res.status(200).json(health);
}
