import { useState } from 'react';
import { learningModules } from '../data/demoData';

export default function Learn() {
  const [selectedModule, setSelectedModule] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  const handleQuizAnswer = (quizIndex, optionIndex, correct) => {
    setQuizAnswers(prev => ({ ...prev, [quizIndex]: optionIndex }));
    setShowExplanation(prev => ({ ...prev, [quizIndex]: true }));
  };

  if (selectedModule) {
    const mod = selectedModule;
    return (
      <div className="page-container">
        <div className="learning-detail">
          <div className="learning-detail-header">
            <button className="back-btn" onClick={() => { setSelectedModule(null); setQuizAnswers({}); setShowExplanation({}); }}>
              ←
            </button>
            <div>
              <h1 style={{ fontSize: '1.8rem' }}>{mod.icon} {mod.title}</h1>
              <p style={{ color: 'var(--text-secondary)' }}>{mod.description}</p>
            </div>
          </div>

          <div className="learning-section">
            <h3>📚 What You Need to Know</h3>
            <div className="learning-content">
              {mod.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          <div className="learning-section">
            <h3>🚩 Red Flags to Watch For</h3>
            <ul className="red-flags-list">
              {mod.redFlags.map((flag, i) => (
                <li key={i}>{flag}</li>
              ))}
            </ul>
          </div>

          {mod.quiz && mod.quiz.length > 0 && (
            <div className="learning-section">
              <h3>🧠 Test Your Knowledge</h3>
              {mod.quiz.map((q, qi) => (
                <div key={qi} className="quiz-container">
                  <p className="quiz-question">{q.question}</p>
                  <div className="quiz-options">
                    {q.options.map((option, oi) => {
                      let className = 'quiz-option';
                      if (quizAnswers[qi] !== undefined) {
                        if (oi === q.correct) className += ' correct';
                        else if (oi === quizAnswers[qi]) className += ' wrong';
                      }
                      return (
                        <button
                          key={oi}
                          className={className}
                          onClick={() => handleQuizAnswer(qi, oi, oi === q.correct)}
                          disabled={quizAnswers[qi] !== undefined}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  {showExplanation[qi] && (
                    <div className="quiz-explanation">
                      {quizAnswers[qi] === q.correct ? '✅ Correct! ' : '❌ Incorrect. '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎓 Scam Safety Learning</h1>
        <p>Learn to identify and protect yourself from common scam tactics</p>
      </div>

      <div className="learning-grid">
        {learningModules.map(mod => (
          <div key={mod.id} className="learning-card" onClick={() => setSelectedModule(mod)}>
            <div className="learning-card-icon">{mod.icon}</div>
            <h3>{mod.title}</h3>
            <p>{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
