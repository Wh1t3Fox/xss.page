import { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';

const MAX_PAYLOAD_LENGTH = 1000;

const scenarios = [
  {
    id: 'search',
    name: 'Search Box Reflection',
    description: 'User input reflected in search results without encoding',
    template: (input) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h2 { color: #333; }
    .result { background: #e3f2fd; padding: 15px; border-radius: 4px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Search Results</h2>
    <p>You searched for:</p>
    <div class="result">${input}</div>
    <p style="margin-top: 20px; color: #666; font-size: 14px;">This demonstrates reflected XSS - user input is directly inserted into HTML without encoding.</p>
  </div>
</body>
</html>`
  },
  {
    id: 'comment',
    name: 'Comment Form',
    description: 'User comment stored and displayed without sanitization',
    template: (input) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f5f5f5; }
    .comment { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #2196F3; }
    .author { font-weight: bold; color: #333; }
    .content { margin-top: 10px; color: #666; }
  </style>
</head>
<body>
  <h2>Comments</h2>
  <div class="comment">
    <div class="author">Anonymous User</div>
    <div class="content">${input}</div>
  </div>
  <p style="color: #666; font-size: 14px; margin-top: 20px;">This demonstrates stored XSS - user content is displayed to other users without sanitization.</p>
</body>
</html>`
  },
  {
    id: 'attribute',
    name: 'Attribute Injection',
    description: 'User input placed in HTML attribute',
    template: (input) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: sans-serif; padding: 20px; }
    input { padding: 10px; border: 2px solid #ddd; border-radius: 4px; width: 300px; }
  </style>
</head>
<body>
  <h2>User Profile</h2>
  <form>
    <label>Username:</label><br>
    <input type="text" value="${input}" />
  </form>
  <p style="color: #666; font-size: 14px; margin-top: 20px;">This demonstrates attribute context XSS - breaking out of the attribute to inject events.</p>
</body>
</html>`
  }
];

export default function XSSDemo() {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id);
  const [userInput, setUserInput] = useState('<img src=x onerror=alert("XSS")>');
  const [iframeUrl, setIframeUrl] = useState(null);

  useEffect(() => {
    // Cleanup blob URL on unmount
    return () => {
      if (iframeUrl) {
        URL.revokeObjectURL(iframeUrl);
      }
    };
  }, [iframeUrl]);

  const handleDemo = () => {
    if (userInput.length > MAX_PAYLOAD_LENGTH) {
      alert(`Input too large. Maximum ${MAX_PAYLOAD_LENGTH} characters.`);
      return;
    }

    const scenario = scenarios.find(s => s.id === selectedScenario);
    if (!scenario) return;

    // Revoke previous blob URL
    if (iframeUrl) {
      URL.revokeObjectURL(iframeUrl);
    }

    // Generate HTML content
    const htmlContent = scenario.template(userInput);

    // Create blob URL for complete isolation
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    setIframeUrl(url);
  };

  const currentScenario = scenarios.find(s => s.id === selectedScenario);

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Warning Banner */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  <strong>Security Note:</strong> These demonstrations run in a sandboxed iframe with blob URLs for complete isolation. No actual XSS vulnerability exists on this page.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Live XSS Demonstrations
            </h2>
            <p className="text-gray-600">
              See how XSS works in different contexts within a safe, isolated environment.
            </p>
          </div>

          {/* Scenario Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Vulnerable Scenario
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`p-4 text-left border-2 rounded-lg transition ${
                    selectedScenario === scenario.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900 text-sm">{scenario.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Payload Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              XSS Payload
            </label>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter XSS payload..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              rows={3}
              maxLength={MAX_PAYLOAD_LENGTH}
            />
            <p className="mt-1 text-xs text-gray-500">
              {userInput.length} / {MAX_PAYLOAD_LENGTH} characters
            </p>
          </div>

          {/* Demo Button */}
          <div className="mb-6">
            <button
              onClick={handleDemo}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              Run Demo
            </button>
          </div>

          {/* Iframe Demo */}
          {iframeUrl && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Demonstration (Sandboxed)
              </label>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={iframeUrl}
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '400px', border: 'none' }}
                  title="XSS Demo Sandbox"
                  onLoad={() => {
                    // Revoke URL after iframe loads to free memory
                    setTimeout(() => {
                      if (iframeUrl) URL.revokeObjectURL(iframeUrl);
                    }, 1000);
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-600">
                <strong>Sandbox restrictions:</strong> allow-scripts only (no forms, popups, top navigation, or same-origin access)
              </p>
            </div>
          )}

          {/* Explanation */}
          {currentScenario && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Why This Works
              </h3>
              <p className="text-sm text-blue-800">
                {currentScenario.description}. The vulnerable code directly inserts user input into HTML without proper encoding, allowing malicious scripts to execute.
              </p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-blue-900 mb-1">Prevention:</p>
                <ul className="text-xs text-blue-800 list-disc list-inside space-y-1">
                  <li>Always encode output based on context (HTML, attribute, JavaScript, URL)</li>
                  <li>Use modern frameworks with automatic escaping (React, Vue, Angular)</li>
                  <li>Implement Content Security Policy (CSP)</li>
                  <li>Never insert untrusted data directly into HTML</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
