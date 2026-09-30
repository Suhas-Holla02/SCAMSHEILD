const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the server. Please check your connection.');
    }
    throw error;
  }
}

export function getSessionId() {
  let sessionId = localStorage.getItem('scamshield_session_id');
  if (!sessionId) {
    sessionId = 'ss_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('scamshield_session_id', sessionId);
  }
  return sessionId;
}

export async function analyzeText(content) {
  return request('/analyze', {
    method: 'POST',
    body: JSON.stringify({ content, sessionId: getSessionId() })
  });
}

export async function analyzeScreenshot(extractedText) {
  return request('/scan', {
    method: 'POST',
    body: JSON.stringify({ extractedText, sessionId: getSessionId() })
  });
}

export async function analyzeUrl(url) {
  return request('/url-check', {
    method: 'POST',
    body: JSON.stringify({ url, sessionId: getSessionId() })
  });
}

export async function getHistory() {
  return request(`/history?sessionId=${getSessionId()}`);
}

export async function deleteAnalysis(id) {
  return request('/history', {
    method: 'DELETE',
    body: JSON.stringify({ id, sessionId: getSessionId() })
  });
}

export async function getDashboardStats() {
  return request(`/dashboard?sessionId=${getSessionId()}`);
}

export async function getHealth() {
  return request('/health');
}
