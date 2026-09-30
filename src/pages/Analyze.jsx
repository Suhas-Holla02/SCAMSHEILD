import { useState } from 'react';
import { analyzeText } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Analyze() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeText(content);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔍 Text Analyzer</h1>
        <p>Paste a suspicious message to analyze it for scam indicators</p>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="input-group">
          <label htmlFor="content">Suspicious Message</label>
          <textarea
            id="content"
            className="textarea-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='Paste a suspicious message here... e.g., "URGENT: Your bank account will be blocked today. Verify your KYC immediately using this link."'
            maxLength={10000}
            disabled={loading}
          />
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {content.length} / 10,000
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!content.trim() || loading}
          >
            {loading ? 'Analyzing...' : '🔍 Analyze Message'}
          </button>
          {result && (
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Clear & Start Over
            </button>
          )}
        </div>
      </form>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {loading && <LoadingState message="Analyzing threat indicators..." />}
        {error && <ErrorState message={error} onRetry={handleSubmit} />}
        {result && <AnalysisResult analysis={result.analysis} usedFallback={result.usedFallback} />}
      </div>
    </div>
  );
}
