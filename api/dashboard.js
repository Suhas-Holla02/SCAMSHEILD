import { setCors } from './lib/cors.js';
import { query, initDatabase, isDbConfigured } from './lib/db.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sessionId = req.query?.sessionId;
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  if (!isDbConfigured()) {
    return res.status(200).json({
      success: true,
      stats: {
        total: 0,
        riskCounts: { low: 0, medium: 0, high: 0, critical: 0 },
        topScamTypes: [],
        recent: []
      },
      dbConnected: false
    });
  }

  try {
    await initDatabase();

    const totalRows = await query(
      'SELECT COUNT(*) as count FROM analyses WHERE session_id = ?',
      [sessionId]
    );

    const riskRows = await query(
      'SELECT risk_level, COUNT(*) as count FROM analyses WHERE session_id = ? GROUP BY risk_level',
      [sessionId]
    );

    const typeRows = await query(
      'SELECT scam_type, COUNT(*) as count FROM analyses WHERE session_id = ? GROUP BY scam_type ORDER BY count DESC LIMIT 5',
      [sessionId]
    );

    const recentRows = await query(
      'SELECT id, type, input_preview, risk_level, risk_score, scam_type, created_at FROM analyses WHERE session_id = ? ORDER BY created_at DESC LIMIT 5',
      [sessionId]
    );

    const riskCounts = { low: 0, medium: 0, high: 0, critical: 0 };
    riskRows.forEach(row => {
      riskCounts[row.risk_level] = row.count;
    });

    return res.status(200).json({
      success: true,
      stats: {
        total: totalRows[0]?.count || 0,
        riskCounts,
        topScamTypes: typeRows,
        recent: recentRows
      },
      dbConnected: true
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    // Return empty stats gracefully if DB query fails rather than crashing
    return res.status(200).json({
      success: true,
      stats: {
        total: 0,
        riskCounts: { low: 0, medium: 0, high: 0, critical: 0 },
        topScamTypes: [],
        recent: []
      },
      dbConnected: false,
      error: 'Database service is temporarily unavailable.'
    });
  }
}
