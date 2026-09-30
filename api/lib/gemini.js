import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;

function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

// Active models supported by Google AI Studio
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash'
];

function withTimeout(promise, ms = 7000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Model request timed out after ${ms}ms`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function analyzeWithGemini(content, type = 'text') {
  const client = getGenAI();

  const prompt = `
You are an expert cybersecurity threat analyst.
Analyze the following ${type} content for scam indicators, social engineering, phishing, or financial risk:

"""
${content}
"""

Return ONLY valid JSON using exactly this structure:
{
  "risk_score": 0,
  "risk_level": "low",
  "scam_type": "None detected",
  "summary": "Brief 1-2 sentence explanation",
  "threat_factors": [
    {
      "factor": "Threat name",
      "severity": "low|medium|high",
      "evidence": "Exact quote or element from text",
      "explanation": "Why this is suspicious"
    }
  ],
  "recommendations": [
    "Practical safety recommendation"
  ],
  "legitimacy_indicators": [
    "Indicator of legitimacy if any"
  ]
}

Rules:
- risk_score must be a number between 0 and 100.
- 0-30 = low, 31-60 = medium, 61-85 = high, 86-100 = critical.
- Provide evidence directly quoted from the content.
- Provide at least 3 practical safety recommendations.
`;

  let lastError = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const result = await withTimeout(model.generateContent(prompt), 6000);
      const response = await result.response;
      let text = response.text();

      if (!text) continue;

      // Clean up markdown code blocks if present
      text = text.trim();
      if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }

      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      // Continue to next candidate model
    }
  }

  throw lastError || new Error('All Gemini candidate models failed');
}