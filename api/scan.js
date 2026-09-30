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
    const { extractedText, sessionId } = req.body || {};

    if (!extractedText || typeof extractedText !== 'string') {
      return res.status(400).json({ error: 'Extracted text is required' });
    }

    if (extractedText.length > 10000) {
      return res.status(400).json({ error: 'Extracted text exceeds maximum length' });
    }

    let result;
    let usedFallback = false;

    try {
      result = await analyzeWithGemini(extractedText, 'screenshot');
    } catch (aiError) {
      console.warn('AI scan analysis temporarily unavailable, using local heuristic fallback:', aiError.message);
      result = fallbackAnalysis(extractedText, 'screenshot');
      usedFallback = true;
    }

    if (isDbConfigured()) {
      try {
        await initDatabase();
        const preview = extractedText.substring(0, 500);
        await query(
          'INSERT INTO analyses (type, input_preview, risk_level, risk_score, scam_type, result_json, session_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['screenshot', preview, result.risk_level, result.risk_score, result.scam_type, JSON.stringify(result), sessionId || null]
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
    console.error('Scan error:', error.message);
    return res.status(500).json({
      error: 'Something went wrong while analyzing the screenshot text.'
    });
  }
}
