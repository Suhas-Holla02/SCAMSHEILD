import { setCors } from './lib/cors.js';
import { query, initDatabase, isDbConfigured } from './lib/db.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;

  if (req.method === 'GET') {
    const sessionId = req.query?.sessionId;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    if (!isDbConfigured()) {
      return res.status(200).json({ success: true, analyses: [], dbConnected: false });
    }

    try {
      await initDatabase();

      const rows = await query(
        'SELECT id, type, input_preview, risk_level, risk_score, scam_type, result_json, created_at FROM analyses WHERE session_id = ? ORDER BY created_at DESC LIMIT 50',
        [sessionId]
      );

      const analyses = rows.map(row => ({
        ...row,
        result: row.result_json ? JSON.parse(row.result_json) : null,
        result_json: undefined
      }));

      return res.status(200).json({ success: true, analyses, dbConnected: true });
    } catch (error) {
      console.error('History error:', error.message);
      return res.status(200).json({
        success: true,
        analyses: [],
        dbConnected: false,
        error: 'Database service is temporarily unavailable.'
      });
    }
  }

  if (req.method === 'DELETE') {
    const { id, sessionId } = req.body || {};
    if (!id || !sessionId) {
      return res.status(400).json({ error: 'Analysis ID and session ID are required' });
    }

    if (!isDbConfigured()) {
      return res.status(503).json({ error: 'Database service is not configured' });
    }

    try {
      await initDatabase();
      await query('DELETE FROM analyses WHERE id = ? AND session_id = ?', [id, sessionId]);
      return res.status(200).json({ success: true, message: 'Analysis deleted' });
    } catch (error) {
      console.error('History delete error:', error.message);
      return res.status(500).json({
        error: 'Database service is temporarily unavailable. Please try again.'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
