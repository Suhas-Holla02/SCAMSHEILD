import RiskScore from './RiskScore';
import ThreatCard from './ThreatCard';

export default function AnalysisResult({ analysis, usedFallback }) {
  if (!analysis) return null;

  return (
    <div className="analysis-result fade-in">
      {usedFallback && (
        <div className="fallback-notice">
          <span>⚠️</span>
          <div>
            <strong>Fallback heuristic — not AI-generated.</strong>
            <p>AI analysis is temporarily unavailable. This result was generated using local safety heuristic rules.</p>
          </div>
        </div>
      )}

      <RiskScore score={analysis.risk_score} level={analysis.risk_level} />

      {analysis.scam_type && analysis.scam_type !== 'None detected' && (
        <div className="analysis-section">
          <h3>🎯 Scam Type: {analysis.scam_type}</h3>
        </div>
      )}

      {analysis.summary && (
        <div className="analysis-section">
          <h3>📋 Summary</h3>
          <div className="analysis-summary">{analysis.summary}</div>
        </div>
      )}

      {analysis.threat_factors && analysis.threat_factors.length > 0 && (
        <div className="analysis-section">
          <h3>🚨 Threat Factors</h3>
          {analysis.threat_factors.map((threat, index) => (
            <ThreatCard key={index} {...threat} />
          ))}
        </div>
      )}

      {analysis.legitimacy_indicators && analysis.legitimacy_indicators.length > 0 && (
        <div className="analysis-section">
          <h3>✅ Legitimacy Indicators</h3>
          <ul className="recommendations-list">
            {analysis.legitimacy_indicators.map((indicator, index) => (
              <li key={index}>{indicator}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="analysis-section">
          <h3>🛡️ Recommended Actions</h3>
          <ul className="recommendations-list">
            {analysis.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.url_details && (
        <div className="analysis-section">
          <h3>🔍 URL Details</h3>
          <div className="url-details">
            <div className="url-detail-row">
              <span className="url-detail-label">Protocol</span>
              <span className="url-detail-value">{analysis.url_details.protocol}</span>
            </div>
            <div className="url-detail-row">
              <span className="url-detail-label">Hostname</span>
              <span className="url-detail-value">{analysis.url_details.hostname}</span>
            </div>
            <div className="url-detail-row">
              <span className="url-detail-label">Path</span>
              <span className="url-detail-value">{analysis.url_details.pathname}</span>
            </div>
          </div>
        </div>
      )}

      {analysis.disclaimer && (
        <p className="risk-score-disclaimer" style={{ textAlign: 'center', marginTop: '1rem' }}>
          {analysis.disclaimer}
        </p>
      )}
    </div>
  );
}
