import { useState, useRef, useCallback } from 'react';
import { analyzeScreenshot } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';

export default function Scan() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload');
  const [dragover, setDragover] = useState(false);
  const inputRef = useRef(null);

  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
  const MAX_SIZE = 10 * 1024 * 1024;

  const handleFile = useCallback((selectedFile) => {
    setError(null);
    setResult(null);
    setExtractedText('');

    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError('Please upload a valid image file (PNG, JPEG, WebP, or GIF)');
      return;
    }

    if (selectedFile.size > MAX_SIZE) {
      setError('File size must be under 10MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
    setStep('ocr');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragover(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const runOCR = async () => {
    setOcrLoading(true);
    setError(null);

    try {
      const Tesseract = await import('tesseract.js');
      const worker = await Tesseract.createWorker('eng');
      const { data: { text } } = await worker.recognize(preview);
      await worker.terminate();

      if (!text.trim()) {
        setError('No text could be extracted from this image. Try a clearer screenshot.');
        setOcrLoading(false);
        return;
      }

      setExtractedText(text.trim());
      setStep('analyze');
    } catch (err) {
      setError('Failed to extract text from the image: ' + err.message);
    } finally {
      setOcrLoading(false);
    }
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await analyzeScreenshot(extractedText);
      setResult(data);
      setStep('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setExtractedText('');
    setResult(null);
    setError(null);
    setStep('upload');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📸 Screenshot Scanner</h1>
        <p>Upload a screenshot of a suspicious message for OCR and AI analysis</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {step === 'upload' && (
          <div
            className={`upload-box ${dragover ? 'dragover' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
          >
            <div className="upload-box-icon">📷</div>
            <h3>Drop an image here or click to upload</h3>
            <p>Supports PNG, JPEG, WebP, GIF • Max 10MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </div>
        )}

        {preview && step !== 'upload' && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="upload-preview" style={{ textAlign: 'center' }}>
              <img src={preview} alt="Uploaded screenshot" />
            </div>
          </div>
        )}

        {step === 'ocr' && (
          <div style={{ textAlign: 'center' }}>
            {ocrLoading ? (
              <LoadingState message="Extracting text from image..." />
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={runOCR}>
                  🔍 Extract Text (OCR)
                </button>
                <button className="btn btn-secondary" onClick={reset}>
                  Choose Different Image
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'analyze' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>📝 Extracted Text</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {extractedText}
              </p>
            </div>
            {loading ? (
              <LoadingState message="Analyzing extracted text for threats..." />
            ) : (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={runAnalysis}>
                  🛡️ Analyze for Threats
                </button>
                <button className="btn btn-secondary" onClick={reset}>
                  Start Over
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'result' && result && (
          <div>
            <AnalysisResult analysis={result.analysis} usedFallback={result.usedFallback} />
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn btn-secondary" onClick={reset}>
                Scan Another Screenshot
              </button>
            </div>
          </div>
        )}

        {error && <ErrorState message={error} onRetry={step === 'ocr' ? runOCR : step === 'analyze' ? runAnalysis : null} />}
      </div>
    </div>
  );
}
