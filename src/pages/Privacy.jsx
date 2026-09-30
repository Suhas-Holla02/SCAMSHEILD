export default function Privacy() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🔒 Privacy Policy</h1>
        <p>How ScamShield AI handles your data</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="privacy-section">
          <h2>What Data Is Processed</h2>
          <p>When you use ScamShield AI, the following data may be processed:</p>
          <ul>
            <li>Text messages you submit for analysis</li>
            <li>Screenshots you upload (processed client-side via OCR, then the extracted text is sent for analysis)</li>
            <li>URLs you submit for structural analysis</li>
          </ul>
          <p>Uploaded images are processed in your browser using OCR technology. The images themselves are not stored on our servers. Only the extracted text is sent for analysis.</p>
        </div>

        <div className="privacy-section">
          <h2>What Is Stored</h2>
          <p>Analysis metadata is stored in our database to provide you with history and dashboard features:</p>
          <ul>
            <li>A preview of the analyzed content (first 500 characters)</li>
            <li>The risk score and risk level</li>
            <li>The detected scam type</li>
            <li>The full analysis result</li>
            <li>A session identifier (generated randomly, not linked to your identity)</li>
            <li>The timestamp of the analysis</li>
          </ul>
          <p>We do not store your full original messages beyond the preview length. We do not store uploaded images.</p>
        </div>

        <div className="privacy-section">
          <h2>How Analysis History Works</h2>
          <p>Your analysis history is linked to a randomly generated session ID stored in your browser's local storage. This means:</p>
          <ul>
            <li>Your history is accessible only from the same browser</li>
            <li>Clearing browser data will disconnect you from your history</li>
            <li>No account or personal information is required</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>AI Processing</h2>
          <p>Submitted text is sent to Google's Gemini AI for analysis. This means:</p>
          <ul>
            <li>Text you submit is processed by Google's AI services</li>
            <li>Google's own privacy policies apply to AI processing</li>
            <li>We do not control how Google processes the data sent to their API</li>
          </ul>
          <p>If AI is unavailable, a local heuristic fallback is used instead. This is clearly labeled in the results.</p>
        </div>

        <div className="privacy-section">
          <h2>Deleting Your Data</h2>
          <p>You can delete individual analyses from the History page at any time. Deleted data is permanently removed from our database.</p>
          <p>To disconnect from all your history, clear your browser's local storage for this site, which removes the session identifier.</p>
        </div>

        <div className="privacy-section">
          <h2>Security</h2>
          <ul>
            <li>All API communications use HTTPS in production</li>
            <li>API keys and secrets are stored server-side only</li>
            <li>Database queries use parameterized statements to prevent SQL injection</li>
            <li>File uploads are validated for type and size</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>Contact</h2>
          <p>ScamShield AI is a student hackathon project built for educational purposes. For questions or concerns, please reach out through the project's repository.</p>
        </div>
      </div>
    </div>
  );
}
