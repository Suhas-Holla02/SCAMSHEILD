export default function ThreatCard({ factor, severity, evidence, explanation }) {
  return (
    <div className={`threat-card ${severity} slide-up`}>
      <div className="threat-card-header">
        <span className="threat-card-title">{factor}</span>
        <span className={`risk-badge ${severity}`}>{severity}</span>
      </div>
      {evidence && (
        <div className="threat-card-evidence">
          <strong>Evidence: </strong>{evidence}
        </div>
      )}
      {explanation && (
        <p className="threat-card-explanation">{explanation}</p>
      )}
    </div>
  );
}
