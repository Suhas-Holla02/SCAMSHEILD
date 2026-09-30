import { setCors } from './lib/cors.js';
import { query, initDatabase, isDbConfigured } from './lib/db.js';

export default async function handler(req, res) {
  if (setCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, sessionId } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (url.length > 2048) {
      return res.status(400).json({ error: 'URL exceeds maximum length' });
    }

    const analysis = analyzeUrl(url);

    if (isDbConfigured()) {
      try {
        await initDatabase();
        await query(
          'INSERT INTO analyses (type, input_preview, risk_level, risk_score, scam_type, result_json, session_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['url', url.substring(0, 500), analysis.risk_level, analysis.risk_score, analysis.scam_type, JSON.stringify(analysis), sessionId || null]
        );
      } catch (dbError) {
        console.error('Database save error:', dbError.message);
      }
    }

    return res.status(200).json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('URL check error:', error.message);
    return res.status(500).json({
      error: 'Something went wrong while analyzing this URL.'
    });
  }
}

function analyzeUrl(url) {
  const threats = [];
  let score = 0;
  let urlObj;

  try {
    urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
  } catch {
    return {
      risk_score: 50,
      risk_level: 'medium',
      scam_type: 'Invalid URL',
      summary: 'The URL format appears to be invalid.',
      threat_factors: [{ factor: 'Invalid URL Format', severity: 'medium', evidence: url, explanation: 'The URL could not be parsed correctly.' }],
      recommendations: ['Do not visit URLs that appear malformed.', 'Verify the URL source.', 'Type URLs directly into your browser.'],
      legitimacy_indicators: [],
      disclaimer: 'This is structural analysis only. It does not guarantee a URL is safe or malicious.'
    };
  }

  if (urlObj.protocol === 'http:') {
    score += 15;
    threats.push({ factor: 'No HTTPS', severity: 'medium', evidence: `Protocol: ${urlObj.protocol}`, explanation: 'The URL uses unencrypted HTTP. Legitimate sites typically use HTTPS.' });
  }

  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipPattern.test(urlObj.hostname)) {
    score += 25;
    threats.push({ factor: 'IP-Based URL', severity: 'high', evidence: `Hostname: ${urlObj.hostname}`, explanation: 'IP-based URLs are often used to hide the true destination.' });
  }

  const shorteners = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'rb.gy', 'is.gd', 'cutt.ly', 'ow.ly', 'shorturl.at'];
  if (shorteners.some(s => urlObj.hostname.includes(s))) {
    score += 20;
    threats.push({ factor: 'URL Shortener', severity: 'medium', evidence: `Domain: ${urlObj.hostname}`, explanation: 'URL shorteners hide the actual destination. Scammers use them to mask malicious links.' });
  }

  const subdomainCount = urlObj.hostname.split('.').length - 2;
  if (subdomainCount > 2) {
    score += 15;
    threats.push({ factor: 'Excessive Subdomains', severity: 'medium', evidence: `Domain: ${urlObj.hostname}`, explanation: 'Excessive subdomains can be used to make a URL look like a legitimate site.' });
  }

  if (urlObj.hostname.includes('-') && urlObj.hostname.split('-').length > 3) {
    score += 10;
    threats.push({ factor: 'Suspicious Domain Format', severity: 'low', evidence: `Domain: ${urlObj.hostname}`, explanation: 'Domains with many hyphens sometimes mimic legitimate domains.' });
  }

  const lookalikes = [
    { real: 'google', fake: ['g00gle', 'googl', 'gooogle', 'goggle'] },
    { real: 'facebook', fake: ['faceb00k', 'facebok', 'faceboook'] },
    { real: 'amazon', fake: ['amaz0n', 'amazn', 'arnazon'] },
    { real: 'microsoft', fake: ['micr0soft', 'mircosoft', 'microsft'] },
    { real: 'apple', fake: ['app1e', 'appie', 'aple'] },
    { real: 'paypal', fake: ['paypa1', 'paypai', 'paypaI'] },
    { real: 'netflix', fake: ['netf1ix', 'netfllx', 'neftlix'] },
    { real: 'bank', fake: ['b4nk', 'banlk', 'bannk'] }
  ];

  for (const { real, fake } of lookalikes) {
    if (fake.some(f => urlObj.hostname.includes(f))) {
      score += 30;
      threats.push({ factor: 'Lookalike Domain', severity: 'high', evidence: `Domain ${urlObj.hostname} resembles ${real}`, explanation: `This domain appears to impersonate ${real} using character substitution.` });
      break;
    }
  }

  const suspiciousTLDs = ['.xyz', '.top', '.click', '.loan', '.work', '.gq', '.tk', '.ml', '.ga', '.cf'];
  if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(tld))) {
    score += 10;
    threats.push({ factor: 'Suspicious TLD', severity: 'low', evidence: `Domain: ${urlObj.hostname}`, explanation: 'This top-level domain is frequently associated with spam and scam websites.' });
  }

  if (url.includes('@') && url.indexOf('@') < url.indexOf(urlObj.hostname)) {
    score += 25;
    threats.push({ factor: 'URL Contains @ Symbol', severity: 'high', evidence: 'URL contains @ before hostname', explanation: 'The @ symbol in URLs can trick browsers into ignoring the text before it.' });
  }

  if (urlObj.pathname.length > 100) {
    score += 5;
    threats.push({ factor: 'Long URL Path', severity: 'low', evidence: `Path length: ${urlObj.pathname.length} characters`, explanation: 'Unusually long URL paths can be used to hide the true destination.' });
  }

  score = Math.min(score, 100);

  let riskLevel = 'low';
  if (score > 85) riskLevel = 'critical';
  else if (score > 60) riskLevel = 'high';
  else if (score > 30) riskLevel = 'medium';

  const legitimacyIndicators = [];
  if (urlObj.protocol === 'https:') legitimacyIndicators.push('Uses HTTPS encryption');
  if (subdomainCount <= 1) legitimacyIndicators.push('Normal subdomain structure');
  if (!ipPattern.test(urlObj.hostname)) legitimacyIndicators.push('Uses a domain name (not raw IP)');

  return {
    risk_score: score,
    risk_level: riskLevel,
    scam_type: threats.length > 0 ? 'Suspicious URL' : 'URL appears normal',
    summary: threats.length > 0 ? `Found ${threats.length} structural concern(s) with this URL.` : 'No significant structural issues detected.',
    url_details: { protocol: urlObj.protocol, hostname: urlObj.hostname, pathname: urlObj.pathname, full_url: urlObj.toString() },
    threat_factors: threats,
    recommendations: ['Always verify URLs before clicking.', 'Type known URLs directly into your browser.', 'Check for subtle misspellings in domain names.', 'Be cautious of URLs in unsolicited messages.', 'Use official apps or bookmarks for important sites.'],
    legitimacy_indicators: legitimacyIndicators,
    disclaimer: 'This is a structural analysis only. It does not guarantee a URL is safe or malicious.'
  };
}
