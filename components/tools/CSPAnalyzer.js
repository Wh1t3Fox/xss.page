import { useState } from 'react';
import { parseCSP, testPayloadAgainstCSP, calculateSecurityScore } from '../../utils/csp-parser';
import { cspDirectives } from '../../data/csp-directives';
import { payloads } from '../../data/payloads';
import CodeBlock from '../CodeBlock';

export default function CSPAnalyzer() {
  const [cspInput, setCSPInput] = useState('');
  const [parsedCSP, setParsedCSP] = useState(null);
  const [securityScore, setSecurityScore] = useState(null);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const handleParse = () => {
    if (!cspInput.trim()) {
      return;
    }

    const parsed = parseCSP(cspInput);
    setParsedCSP(parsed);

    const score = calculateSecurityScore(parsed);
    setSecurityScore(score);

    // Reset test results when parsing new CSP
    setTestResult(null);
    setSelectedPayload(null);
  };

  const handleTestPayload = (payload) => {
    if (!parsedCSP) return;

    setSelectedPayload(payload);
    const result = testPayloadAgainstCSP(payload.payload, parsedCSP);
    setTestResult(result);
  };

  const handleClear = () => {
    setCSPInput('');
    setParsedCSP(null);
    setSecurityScore(null);
    setTestResult(null);
    setSelectedPayload(null);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyze CSP Policy</h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="csp-input" className="block text-sm font-medium text-gray-700 mb-2">
              Paste your CSP header or policy
            </label>
            <textarea
              id="csp-input"
              value={cspInput}
              onChange={(e) => setCSPInput(e.target.value)}
              placeholder="Example: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleParse}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Analyze Policy
            </button>
            {parsedCSP && (
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Score */}
      {securityScore && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Security Score</h3>

          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                securityScore.color === 'green' ? 'bg-green-100 text-green-700' :
                securityScore.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                securityScore.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                securityScore.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {securityScore.score}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-2xl font-semibold text-gray-900">{securityScore.rating}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  securityScore.color === 'green' ? 'bg-green-100 text-green-700' :
                  securityScore.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                  securityScore.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  securityScore.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {securityScore.score}/100
                </span>
              </div>

              {securityScore.issues && securityScore.issues.length > 0 && (
                <ul className="space-y-1 text-sm text-gray-600">
                  {securityScore.issues.map((issue, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Warnings and Errors */}
      {parsedCSP && (parsedCSP.warnings || parsedCSP.errors) && (
        <div className="space-y-4">
          {parsedCSP.errors && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Errors</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc list-inside space-y-1">
                      {parsedCSP.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {parsedCSP.warnings && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warnings</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      {parsedCSP.warnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Directives Breakdown */}
      {parsedCSP && Object.keys(parsedCSP.directives).length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Policy Directives</h3>

          <div className="space-y-4">
            {Object.entries(parsedCSP.directives).map(([name, directive]) => (
              <div key={name} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{directive.name}</h4>
                      {cspDirectives[directive.name]?.deprecated && (
                        <span className="px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 font-semibold">
                          Deprecated
                        </span>
                      )}
                      {cspDirectives[directive.name]?.xssImpact === 'critical' && (
                        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 font-semibold">
                          Critical for XSS
                        </span>
                      )}
                    </div>

                    {cspDirectives[directive.name] && (
                      <p className="text-sm text-gray-600 mb-2">
                        {cspDirectives[directive.name].description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {directive.values.map((value, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-mono ${
                            value === "'unsafe-inline'" || value === "'unsafe-eval'" || value === '*'
                              ? 'bg-red-100 text-red-700'
                              : value.startsWith("'nonce-") || value.startsWith("'sha")
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payload Testing */}
      {parsedCSP && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Test Payloads Against Policy</h3>

          <p className="text-gray-600 mb-4">
            Select a payload to test if it would be blocked by this CSP policy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {payloads.slice(0, 12).map((payload) => (
              <button
                key={payload.id}
                onClick={() => handleTestPayload(payload)}
                className={`text-left p-4 rounded-lg border-2 transition ${
                  selectedPayload?.id === payload.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    {payload.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    payload.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    payload.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payload.severity}
                  </span>
                </div>
                <code className="text-sm text-gray-800 break-all block">
                  {payload.payload.length > 60 ? payload.payload.substring(0, 60) + '...' : payload.payload}
                </code>
              </button>
            ))}
          </div>

          {/* Test Result */}
          {testResult && selectedPayload && (
            <div className={`p-6 rounded-lg border-2 ${
              testResult.blocked
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {testResult.blocked ? (
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className={`text-lg font-semibold mb-2 ${
                    testResult.blocked ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {testResult.blocked ? 'Blocked ✓' : 'Not Blocked ✗'}
                  </h4>

                  <p className={`mb-3 ${
                    testResult.blocked ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {testResult.reason}
                  </p>

                  {testResult.directive && (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Directive:</strong> <code className="bg-white px-2 py-1 rounded">{testResult.directive}</code>
                    </p>
                  )}

                  {testResult.recommendation && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Recommendation:</p>
                      <p className="text-sm text-gray-700">{testResult.recommendation}</p>
                    </div>
                  )}

                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Tested Payload:</p>
                    <CodeBlock code={selectedPayload.payload} language="html" showCopy={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
