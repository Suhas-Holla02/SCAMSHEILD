import { setCors } from './lib/cors.js';
import { analyzeWithGemini } from './lib/gemini.js';
import { fallbackAnalysis } from './lib/fallback.js';
import { query, initDatabase, isDbConfigured } from './lib/db.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, sessionId } = req.body || {};

    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required and must be a string' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content exceeds maximum length of 10,000 characters' });
    }

    let result;
    let usedFallback = false;

    try {
      result = await analyzeWithGemini(content, 'text');
    } catch (aiError) {
      console.warn('AI analysis temporarily unavailable, using local heuristic fallback:', aiError.message);
      result = fallbackAnalysis(content, 'text');
      usedFallback = true;
    }

    // Try to save to database if configured, but do not fail the analysis if DB is offline
    if (isDbConfigured()) {
      try {
        await initDatabase();
        const preview = content.substring(0, 500);
        await query(
          'INSERT INTO analyses (type, input_preview, risk_level, risk_score, scam_type, result_json, session_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['text', preview, result.risk_level, result.risk_score, result.scam_type, JSON.stringify(result), sessionId || null]
        );
      } catch (dbError) {
        console.error('Database save error:', dbError.message);
      }
    }

    return res.status(200).json({
      success: true,
      analysis: result,
      usedFallback
    });
  } catch (error) {
    console.error('Analysis error:', error.message);
    return res.status(500).json({
      error: 'Something went wrong while analyzing this message.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
