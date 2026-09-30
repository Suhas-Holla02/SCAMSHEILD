import { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { Link } from 'react-router-dom';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      setStats(data.stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const typeIcons = { text: '📝', screenshot: '📸', url: '🔗' };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>Overview of your scam analysis activity</p>
      </div>

      {loading && <LoadingState message="Loading dashboard..." />}
      {error && <ErrorState message={error} onRetry={fetchStats} />}

      {stats && (
        <div className="fade-in">
          <div className="dashboard-grid">
            <div className="stat-card total">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Analyses</div>
            </div>
            <div className="stat-card high">
              <div className="stat-value">{(stats.riskCounts.high || 0) + (stats.riskCounts.critical || 0)}</div>
              <div className="stat-label">High Risk</div>
            </div>
            <div className="stat-card medium">
              <div className="stat-value">{stats.riskCounts.medium || 0}</div>
              <div className="stat-label">Medium Risk</div>
            </div>
            <div className="stat-card low">
              <div className="stat-value">{stats.riskCounts.low || 0}</div>
              <div className="stat-label">Low Risk</div>
            </div>
          </div>

          {stats.topScamTypes && stats.topScamTypes.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="section-title">🎯 Common Scam Types</h2>
              <div className="dashboard-grid">
                {stats.topScamTypes.map((type, i) => (
                  <div key={i} className="card">
                    <div className="card-title">{type.scam_type || 'Unknown'}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '0.5rem' }}>
                      {type.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.recent && stats.recent.length > 0 && (
            <div>
              <h2 className="section-title">🕒 Recent Analyses</h2>
              <div className="history-list">
                {stats.recent.map(item => (
                  <div key={item.id} className="history-card">
                    <div className="history-card-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>{typeIcons[item.type]}</span>
                        <span className={`risk-badge ${item.risk_level}`}>
                          {item.risk_level} • {item.risk_score}/100
                        </span>
                      </div>
                      <p className="history-card-preview">{item.input_preview}</p>
                      <div className="history-card-meta">
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <Link to="/history" className="btn btn-secondary">View All History</Link>
              </div>
            </div>
          )}

          {stats.total === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <h3>No data yet</h3>
              <p>Start analyzing messages to populate your dashboard.</p>
              <Link to="/analyze" className="btn btn-primary" style={{ marginTop: '1rem' }}>Analyze a Message</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
