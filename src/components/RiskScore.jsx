export default function RiskScore({ score, level }) {
  return (
    <div className="risk-score-container fade-in">
      <div className={`risk-score-circle ${level}`}>
        <span className={`risk-score-number ${level}`}>{score}</span>
        <span className="risk-score-label">/100</span>
      </div>
      <span className={`risk-badge ${level}`}>
        {level === 'critical' ? '🚨' : level === 'high' ? '⚠️' : level === 'medium' ? '⚡' : '✅'}
        {level.toUpperCase()} RISK
      </span>
      <p className="risk-score-disclaimer">AI-assisted risk assessment based on detected indicators</p>
    </div>
  );
}
