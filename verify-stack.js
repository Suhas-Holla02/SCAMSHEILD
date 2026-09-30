import { createServer } from 'vite';

async function verifyFullStack() {
  console.log('==================================================');
  console.log('🚀 SCAMSHIELD AI: FULL STACK AUTOMATED AUDIT');
  console.log('==================================================\n');

  let server;
  let passed = 0;
  let failed = 0;

  try {
    console.log('1. Starting Vite Dev Server with API Dev Engine...');
    server = await createServer({
      server: { port: 5173 }
    });
    await server.listen();

    const address = server.httpServer.address();
    const port = address.port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`   ✅ Vite Dev Server active at ${baseUrl}\n`);

    // Helper fetch
    async function testEndpoint(name, url, options = {}) {
      try {
        const res = await fetch(`${baseUrl}${url}`, options);
        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          data = await res.text();
        }

        if (res.ok) {
          console.log(`✅ [${res.status}] ${name} -> OK`);
          passed++;
          return { ok: true, status: res.status, data };
        } else {
          console.error(`❌ [${res.status}] ${name} -> Failed:`, data);
          failed++;
          return { ok: false, status: res.status, data };
        }
      } catch (err) {
        console.error(`❌ ${name} Network Error:`, err.message);
        failed++;
        return { ok: false, error: err.message };
      }
    }

    console.log('2. Testing Frontend SPA Routes:');
    await testEndpoint('Frontend Homepage (/)', '/');
    await testEndpoint('Frontend Route (/analyze)', '/analyze');
    await testEndpoint('Frontend Route (/scan)', '/scan');
    await testEndpoint('Frontend Route (/url-check)', '/url-check');
    await testEndpoint('Frontend Route (/dashboard)', '/dashboard');
    await testEndpoint('Frontend Route (/history)', '/history');
    await testEndpoint('Frontend Route (/learn)', '/learn');
    await testEndpoint('Frontend Route (/simulator)', '/simulator');
    await testEndpoint('Frontend Route (/privacy)', '/privacy');

    console.log('\n3. Testing Backend API Routes (Serverless Endpoints):');
    // Health check
    await testEndpoint('GET /api/health', '/api/health');

    // Dashboard check
    await testEndpoint('GET /api/dashboard', '/api/dashboard?sessionId=audit_session_1');

    // History check
    await testEndpoint('GET /api/history', '/api/history?sessionId=audit_session_1');

    // URL Check
    await testEndpoint('POST /api/url-check', '/api/url-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'http://amaz0n-security-login.xyz/verify',
        sessionId: 'audit_session_1'
      })
    });

    // Analyze Message (Text Analyzer / Fallback Engine)
    await testEndpoint('POST /api/analyze', '/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: 'URGENT: Your bank account has been blocked today. Verify your KYC immediately using this link: http://fake-bank.xyz',
        sessionId: 'audit_session_1'
      })
    });

    // Screenshot OCR / Text Scanner Endpoint
    await testEndpoint('POST /api/scan', '/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        extractedText: 'CONGRATULATIONS! You won $50,000 in the International Lottery! Send $199 fee to claim.',
        sessionId: 'audit_session_1'
      })
    });

    console.log('\n==================================================');
    console.log(`📊 Audit Results: ${passed} passed, ${failed} failed.`);
    console.log('==================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal Audit Error:', error);
    process.exit(1);
  } finally {
    if (server) {
      await server.close();
      console.log('🔌 Test server closed cleanly.\n');
    }
  }
}

verifyFullStack();
