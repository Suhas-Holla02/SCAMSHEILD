import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { demoMessages } from '../data/demoData';
import { analyzeText } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';

export default function Home() {
  const navigate = useNavigate();
  const [demoResult, setDemoResult] = useState(null);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoError, setDemoError] = useState(null);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const handleDemo = async (demo) => {
    setSelectedDemo(demo);
    setDemoLoading(true);
    setDemoError(null);
    setDemoResult(null);

    try {
      const data = await analyzeText(demo.message);
      setDemoResult(data);
    } catch (err) {
      setDemoError(err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            🔒 AI-Powered Scam Detection
          </div>
          <h1>
            <span className="gradient-text">SCAMSHIELD</span> AI
          </h1>
          <h2>Don't Just Detect Scams. Understand Them.</h2>
          <p className="hero-subtitle">
            Analyze suspicious messages, screenshots, and links with AI and understand what makes them risky.
          </p>
          <div className="hero-buttons">
            <Link to="/analyze" className="btn btn-primary btn-lg">
              🔍 Scan a Message
            </Link>
            <a href="#demo" className="btn btn-secondary btn-lg">
              ⚡ Try Demo
            </a>
          </div>
          <div className="hero-features">
            <div className="hero-feature">
              <div className="feature-icon">📝</div>
              <h3>Text Analysis</h3>
              <p>Paste suspicious messages for instant AI analysis</p>
            </div>
            <div className="hero-feature">
              <div className="feature-icon">📸</div>
              <h3>Screenshot Scan</h3>
              <p>Upload screenshots for OCR + AI threat detection</p>
            </div>
            <div className="hero-feature">
              <div className="feature-icon">🔗</div>
              <h3>URL Checker</h3>
              <p>Analyze suspicious links for structural threats</p>
            </div>
            <div className="hero-feature">
              <div className="feature-icon">🎓</div>
              <h3>Learn & Practice</h3>
              <p>Educational modules and interactive simulators</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="page-container">
        <div className="page-header">
          <h1>Try a Demo</h1>
          <p>Click any example below to see ScamShield AI in action. These are fictional messages for demonstration.</p>
        </div>

        <div className="demo-grid">
          {demoMessages.map(demo => (
            <div
              key={demo.id}
              className="demo-card"
              onClick={() => handleDemo(demo)}
            >
              <div className="demo-card-icon">{demo.icon}</div>
              <h3>{demo.title}</h3>
              <div className="demo-category">{demo.category}</div>
              <p>{demo.description}</p>
            </div>
          ))}
        </div>

        {selectedDemo && (
          <div style={{ marginTop: '2rem' }}>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>📩 Demo Message: {selectedDemo.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.7 }}>
                "{selectedDemo.message}"
              </p>
            </div>

            {demoLoading && <LoadingState message="Analyzing demo message..." />}
            {demoError && (
              <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Analysis Error</h3>
                <p>{demoError}</p>
                <button className="btn btn-primary" onClick={() => handleDemo(selectedDemo)}>Retry</button>
              </div>
            )}
            {demoResult && (
              <AnalysisResult analysis={demoResult.analysis} usedFallback={demoResult.usedFallback} />
            )}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>ScamShield AI &mdash; Built for educational purposes</p>
        <p style={{ marginTop: '0.5rem' }}>
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </footer>
    </>
  );
}
