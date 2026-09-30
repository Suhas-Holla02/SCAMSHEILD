import { useState } from 'react';
import { simulatorScenarios } from '../data/demoData';

export default function Simulator() {
  const [expanded, setExpanded] = useState(null);
  const [revealedFlags, setRevealedFlags] = useState({});

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const revealFlag = (scenarioId, flagIndex) => {
    setRevealedFlags(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        [flagIndex]: true
      }
    }));
  };

  const getRevealedCount = (scenarioId, totalFlags) => {
    const revealed = revealedFlags[scenarioId] || {};
    return Object.keys(revealed).length;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎮 Scam Simulator</h1>
        <p>Practice identifying red flags in fictional scam scenarios. Click the flags to reveal explanations.</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {simulatorScenarios.map(scenario => (
          <div key={scenario.id} className="simulator-card">
            <div className="simulator-card-header" onClick={() => toggleExpand(scenario.id)}>
              <div>
                <span className="simulator-card-title">{scenario.title}</span>
                {expanded === scenario.id && (
                  <span style={{ marginLeft: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {getRevealedCount(scenario.id)} / {scenario.redFlags.length} flags found
                  </span>
                )}
              </div>
              <span className={`simulator-difficulty ${scenario.difficulty}`}>
                {scenario.difficulty}
              </span>
            </div>

            {expanded === scenario.id && (
              <div className="simulator-body fade-in">
                <div className="simulator-message">
                  {scenario.message}
                </div>

                <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                  🚩 Can you spot the red flags? Click each to reveal:
                </h4>

                <div className="simulator-flags">
                  {scenario.redFlags.map((flag, index) => {
                    const isRevealed = revealedFlags[scenario.id]?.[index];
                    return (
                      <button
                        key={index}
                        className={`simulator-flag ${isRevealed ? 'revealed' : ''}`}
                        onClick={() => revealFlag(scenario.id, index)}
                      >
                        {isRevealed ? '✅ ' : '💡 '}
                        {flag.text}
                        {isRevealed && (
                          <span className="simulator-flag-hint">{flag.hint}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="card" style={{ marginTop: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ⚠️ All scenarios shown are <strong>fictional</strong> and created for educational purposes only.
            They do not represent real organizations or attempts.
          </p>
        </div>
      </div>
    </div>
  );
}
