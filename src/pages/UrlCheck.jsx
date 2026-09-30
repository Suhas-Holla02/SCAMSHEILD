import { useState } from 'react';
import { analyzeUrl } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function UrlCheck() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔗 URL Analyzer</h1>
        <p>Analyze a suspicious URL for structural threat indicators</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="url">Suspicious URL</label>
            <input
              id="url"
              type="text"
              className="text-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., http://amaz0n-secure-login.xyz/verify"
              maxLength={2048}
              disabled={loading}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={!url.trim() || loading}>
              {loading ? 'Analyzing...' : '🔍 Analyze URL'}
            </button>
            {result && (
              <button type="button" className="btn btn-secondary" onClick={() => { setUrl(''); setResult(null); }}>
                Clear
              </button>
            )}
          </div>
        </form>

        {loading && <LoadingState message="Analyzing URL structure..." />}
        {error && <ErrorState message={error} onRetry={handleSubmit} />}
        {result && <AnalysisResult analysis={result.analysis} />}
      </div>
    </div>
  );
}
