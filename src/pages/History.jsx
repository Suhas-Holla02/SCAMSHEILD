import { useState, useEffect } from 'react';
import { getHistory, deleteAnalysis } from '../services/api';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import AnalysisResult from '../components/AnalysisResult';

export default function History() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setAnalyses(data.analyses || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this analysis?')) return;
    try {
      await deleteAnalysis(id);
      setAnalyses(prev => prev.filter(a => a.id !== id));
      if (selectedAnalysis?.id === id) setSelectedAnalysis(null);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const typeIcons = { text: '📝', screenshot: '📸', url: '🔗' };

  if (selectedAnalysis) {
    return (
      <div className="page-container">
        <button className="btn btn-secondary" onClick={() => setSelectedAnalysis(null)} style={{ marginBottom: '1.5rem' }}>
          ← Back to History
        </button>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span>{typeIcons[selectedAnalysis.type]}</span>
            <span className={`risk-badge ${selectedAnalysis.risk_level}`}>
              {selectedAnalysis.risk_level} • {selectedAnalysis.risk_score}/100
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            "{selectedAnalysis.input_preview}"
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
            {formatDate(selectedAnalysis.created_at)}
          </p>
        </div>
        {selectedAnalysis.result && (
          <AnalysisResult analysis={selectedAnalysis.result} />
        )}
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📜 Analysis History</h1>
        <p>View your past analyses</p>
      </div>

      {loading && <LoadingState message="Loading history..." />}
      {error && <ErrorState message={error} onRetry={fetchHistory} />}

      {!loading && !error && analyses.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">💭</div>
          <h3>No analyses yet</h3>
          <p>Start analyzing messages, screenshots, or URLs to see your history here.</p>
        </div>
      )}

      {!loading && analyses.length > 0 && (
        <div className="history-list">
          {analyses.map(analysis => (
            <div key={analysis.id} className="history-card" onClick={() => setSelectedAnalysis(analysis)}>
              <div className="history-card-info">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>{typeIcons[analysis.type]}</span>
                  <span className={`risk-badge ${analysis.risk_level}`}>
                    {analysis.risk_level} • {analysis.risk_score}/100
                  </span>
                  {analysis.scam_type && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{analysis.scam_type}</span>}
                </div>
                <p className="history-card-preview">{analysis.input_preview}</p>
                <div className="history-card-meta">
                  <span>{formatDate(analysis.created_at)}</span>
                  <span>{analysis.type}</span>
                </div>
              </div>
              <div className="history-card-actions">
                <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(analysis.id); }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
