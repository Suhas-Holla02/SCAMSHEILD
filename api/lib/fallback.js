export function fallbackAnalysis(content, type = 'text') {
  const text = content.toLowerCase();
  const threats = [];
  let score = 0;

  // Urgency patterns
  const urgencyWords = ['urgent', 'immediately', 'right now', 'today only', 'act now', 'expires', 'last chance', 'limited time', 'hurry', 'don\'t delay', 'within 24 hours', 'account will be blocked', 'suspended'];
  const foundUrgency = urgencyWords.filter(w => text.includes(w));
  if (foundUrgency.length > 0) {
    score += Math.min(foundUrgency.length * 12, 30);
    threats.push({
      factor: 'Urgency Manipulation',
      severity: foundUrgency.length > 2 ? 'high' : 'medium',
      evidence: `Contains urgency language: ${foundUrgency.slice(0, 3).join(', ')}`,
      explanation: 'Scammers create artificial urgency to prevent victims from thinking critically or verifying claims.'
    });
  }

  // Financial request patterns
  const financialWords = ['bank account', 'credit card', 'payment', 'transfer', 'bitcoin', 'crypto', 'wire transfer', 'gift card', 'otp', 'pin', 'cvv', 'ssn', 'social security'];
  const foundFinancial = financialWords.filter(w => text.includes(w));
  if (foundFinancial.length > 0) {
    score += Math.min(foundFinancial.length * 10, 25);
    threats.push({
      factor: 'Financial Information Request',
      severity: foundFinancial.length > 1 ? 'high' : 'medium',
      evidence: `References financial terms: ${foundFinancial.slice(0, 3).join(', ')}`,
      explanation: 'Legitimate organizations rarely ask for sensitive financial information via messages.'
    });
  }

  // Suspicious links
  const linkPatterns = /(?:https?:\/\/)?(?:bit\.ly|tinyurl|goo\.gl|t\.co|rb\.gy|is\.gd|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|[a-z0-9-]+\.[a-z]{2,}\.[a-z]{2,})/gi;
  const foundLinks = text.match(linkPatterns);
  if (foundLinks) {
    score += 15;
    threats.push({
      factor: 'Suspicious Link',
      severity: 'high',
      evidence: `Contains link(s): ${foundLinks.slice(0, 2).join(', ')}`,
      explanation: 'Links in unsolicited messages may lead to phishing sites or malware downloads.'
    });
  }

  // Impersonation patterns
  const impersonationWords = ['verify your', 'confirm your identity', 'kyc', 'update your account', 'unusual activity', 'security alert', 'we noticed', 'your account has been'];
  const foundImpersonation = impersonationWords.filter(w => text.includes(w));
  if (foundImpersonation.length > 0) {
    score += Math.min(foundImpersonation.length * 10, 20);
    threats.push({
      factor: 'Impersonation',
      severity: 'high',
      evidence: `Contains impersonation language: ${foundImpersonation.slice(0, 3).join(', ')}`,
      explanation: 'Scammers impersonate trusted organizations to trick victims into sharing credentials.'
    });
  }

  // Prize/reward patterns
  const prizeWords = ['congratulations', 'you won', 'winner', 'prize', 'reward', 'lottery', 'selected', 'lucky', 'claim your'];
  const foundPrize = prizeWords.filter(w => text.includes(w));
  if (foundPrize.length > 0) {
    score += Math.min(foundPrize.length * 10, 20);
    threats.push({
      factor: 'Prize/Reward Scam',
      severity: 'medium',
      evidence: `Contains prize language: ${foundPrize.slice(0, 3).join(', ')}`,
      explanation: 'Unsolicited prize notifications are almost always scams designed to collect personal information or fees.'
    });
  }

  // Threat patterns
  const threatWords = ['legal action', 'arrest', 'warrant', 'police', 'court', 'penalty', 'fine', 'jail', 'prosecuted'];
  const foundThreats = threatWords.filter(w => text.includes(w));
  if (foundThreats.length > 0) {
    score += Math.min(foundThreats.length * 10, 20);
    threats.push({
      factor: 'Threat/Intimidation',
      severity: 'high',
      evidence: `Contains threatening language: ${foundThreats.slice(0, 3).join(', ')}`,
      explanation: 'Scammers use threats of legal action or arrest to create fear and compliance.'
    });
  }

  score = Math.min(score, 100);

  let riskLevel = 'low';
  if (score > 85) riskLevel = 'critical';
  else if (score > 60) riskLevel = 'high';
  else if (score > 30) riskLevel = 'medium';

  let scamType = 'None detected';
  if (threats.length > 0) {
    const types = threats.map(t => t.factor);
    if (types.includes('Impersonation')) scamType = 'Phishing';
    else if (types.includes('Prize/Reward Scam')) scamType = 'Prize Scam';
    else if (types.includes('Financial Information Request')) scamType = 'Financial Fraud';
    else if (types.includes('Threat/Intimidation')) scamType = 'Intimidation Scam';
    else scamType = 'Suspicious Message';
  }

  return {
    risk_score: score,
    risk_level: riskLevel,
    scam_type: scamType,
    summary: threats.length > 0
      ? `Detected ${threats.length} potential threat indicator(s) in this ${type} content.`
      : 'No significant scam indicators detected in this content.',
    threat_factors: threats,
    recommendations: [
      'Do not click on any links in suspicious messages.',
      'Never share passwords, OTPs, or financial information via messages.',
      'Verify claims by contacting the organization through their official website or app.',
      'Report suspicious messages to relevant authorities.',
      'If in doubt, do not respond to the message.'
    ],
    legitimacy_indicators: threats.length === 0 ? ['No obvious scam patterns detected'] : [],
    is_fallback: true,
    fallback_notice: 'This analysis was generated using local heuristic rules, not AI. Results may be less accurate.'
  };
}
