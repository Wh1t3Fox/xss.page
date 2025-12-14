import { useState } from 'react';
import { filters, filterOptions } from '../data/filters';
import { contexts, contextOptions } from '../data/contexts';
import { detectXSS, getSeverity } from '../utils/xss-detector';
import ErrorBoundary from './ErrorBoundary';

const MAX_PAYLOAD_LENGTH = 10000;

export default function PayloadTester() {
  const [payload, setPayload] = useState('<script>alert(1)</script>');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [selectedContext, setSelectedContext] = useState('html');
  const [result, setResult] = useState(null);

  const handleTest = () => {
    if (payload.length > MAX_PAYLOAD_LENGTH) {
      setResult({
        error: `Payload too large. Maximum ${MAX_PAYLOAD_LENGTH} characters.`
      });
      return;
    }

    const filter = filters[selectedFilter];
    const context = contexts[selectedContext];

    if (!filter || !context) {
      setResult({ error: 'Invalid filter or context selected' });
      return;
    }

    // Apply filter
    const filteredPayload = filter.apply(payload);

    // Apply context
    const contextualPayload = context.template(filteredPayload);

    // Detect XSS
    const detection = detectXSS(filteredPayload);
    const severity = getSeverity(detection.patterns);

    setResult({
      original: payload,
      filtered: filteredPayload,
      contextual: contextualPayload,
      detection,
      severity,
      filterName: filter.name,
      contextName: context.name,
      safetyNote: context.safetyNote
    });
  };

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              XSS Payload Tester
            </h2>
            <p className="text-gray-600">
              Test how payloads behave when filtered and placed in different contexts.
              This helps understand both attack vectors and defense mechanisms.
            </p>
          </div>

          {/* Payload Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payload
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Enter XSS payload to test..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              rows={4}
              maxLength={MAX_PAYLOAD_LENGTH}
            />
            <p className="mt-1 text-xs text-gray-500">
              {payload.length} / {MAX_PAYLOAD_LENGTH} characters
            </p>
          </div>

          {/* Filter and Context Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Filter Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter Type
              </label>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-600">
                {filters[selectedFilter]?.description}
              </p>
            </div>

            {/* Context Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Injection Context
              </label>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {contextOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-gray-600">
                {contexts[selectedContext]?.description}
              </p>
            </div>
          </div>

          {/* Test Button */}
          <div className="mb-6">
            <button
              onClick={handleTest}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
            >
              Test Payload
            </button>
          </div>

          {/* Results */}
          {result && !result.error && (
            <div className="space-y-6">
              {/* Processing Steps */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Processing Steps</h3>

                {/* Step 1: Original */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">1. Original Payload</h4>
                  </div>
                  <code className="block bg-white border border-gray-300 p-3 rounded text-sm overflow-x-auto">
                    {result.original}
                  </code>
                </div>

                {/* Step 2: After Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">2. After {result.filterName}</h4>
                    {result.original !== result.filtered && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Modified</span>
                    )}
                  </div>
                  <code className="block bg-white border border-gray-300 p-3 rounded text-sm overflow-x-auto">
                    {result.filtered}
                  </code>
                </div>

                {/* Step 3: In Context */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">3. In {result.contextName}</h4>
                  </div>
                  <code className="block bg-white border border-gray-300 p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                    {result.contextual}
                  </code>
                </div>
              </div>

              {/* Detection Results */}
              <div className={`border-l-4 rounded-lg p-4 ${
                result.detection.wouldExecute
                  ? 'bg-red-50 border-red-400'
                  : 'bg-green-50 border-green-400'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {result.detection.wouldExecute ? (
                      <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    ) : (
                      <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className={`text-lg font-semibold ${
                      result.detection.wouldExecute ? 'text-red-900' : 'text-green-900'
                    }`}>
                      {result.detection.wouldExecute ? 'Potential XSS Detected' : 'No XSS Detected'}
                    </h3>
                    {result.detection.patterns.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Detected Patterns:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.detection.patterns.map((pattern, index) => (
                            <span
                              key={index}
                              className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                            >
                              {pattern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.detection.wouldExecute && (
                      <div className="mt-3">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          result.severity === 'critical' ? 'bg-red-600 text-white' :
                          result.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                          result.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          Severity: {result.severity.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {result.safetyNote && (
                      <div className="mt-3 text-sm text-gray-700">
                        <strong>Defense:</strong> {result.safetyNote}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              {result.detection.disclaimer && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-xs text-blue-700">
                    <strong>Note:</strong> {result.detection.note}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {result?.error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {result.error}
              </p>
            </div>
          )}

          {/* Educational Note */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Educational Purpose:</strong> This tool simulates how different filters and contexts affect XSS payloads.
              Understanding these mechanisms is crucial for both security testing and implementing proper defenses.
              Always test only on systems you own or have permission to test.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
