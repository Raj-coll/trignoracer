// src/components/AdminPage.jsx
import { useState } from 'react';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProblem(null);

    try {
      const response = await fetch('http://localhost:3001/api/generate-problem', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setGeneratedProblem(data);
    } catch (err) {
      setError('Failed to fetch problem. Is the server running?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (!generatedProblem) return;
    // The '2' formats the JSON nicely with 2-space indentation
    const problemString = JSON.stringify(generatedProblem, null, 2);
    navigator.clipboard.writeText(problemString);
    alert('Problem JSON copied to clipboard!');
  };

  return (
    <div className="screen" style={{ justifyContent: 'center', background: '#f0f0f0' }}>
      <div className="modal-content" style={{ gap: '25px' }}>
        <h2>AI Problem Generator</h2>
        <button className="button-primary" onClick={handleGenerateClick} disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate New Level'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {generatedProblem && (
          <div style={{ textAlign: 'left', width: '100%', maxWidth: '600px' }}>
            <h3>Generated Problem:</h3>
            <textarea
              readOnly
              style={{ width: '100%', height: '300px', fontFamily: 'monospace' }}
              value={JSON.stringify(generatedProblem, null, 2)}
            />
            <button className="button-secondary" style={{marginTop: '10px'}} onClick={handleCopyToClipboard}>
              Copy to Clipboard
            </button>
            <p><strong>Next Step:</strong> Paste this into your `src/data/gameData.js` file.</p>
          </div>
        )}
      </div>
    </div>
  );
}