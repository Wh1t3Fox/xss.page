import { useState } from 'react';
import { generateMutations, testAgainstFilter, formatStrategyName } from '../../utils/payload-fuzzer';
import { copyToClipboard } from '../../utils/clipboard';

export default function PayloadFuzzer() {
  // State management
  const [basePayload, setBasePayload] = useState('');
  const [strategies, setStrategies] = useState({
    htmlEntities: false,
    urlEncoding: false,
    unicodeEscapes: false,
    base64: false,
    caseVariations: false,
    quoteSubstitution: false,
    whitespaceVariation: false,
    nullBytes: false,
    comments: false,
    protocolVariation: false,
    obfuscation: false
  });
  const [filterPattern, setFilterPattern] = useState('');
  const [results, setResults] = useState(null);
  const [filterResults, setFilterResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Example payloads
  const examples = {
    basic: '<script>alert(1)</script>',
    eventHandler: '<img src=x onerror=alert(1)>',
    svg: '<svg/onload=alert(1)>',
    protocol: 'javascript:alert(1)',
    iframe: '<iframe src="javascript:alert(1)">',
  };

  // Event handlers
  const handleGenerate = () => {
    if (!basePayload.trim()) {
      alert('Please enter a base payload');
      return;
    }

    // Check if at least one strategy is selected
    const hasStrategy = Object.values(strategies).some(v => v);
    if (!hasStrategy) {
      alert('Please select at least one mutation strategy');
      return;
    }

    const mutationResults = generateMutations(basePayload, strategies);
    setResults(mutationResults);

    if (filterPattern && filterPattern.trim()) {
      const filterTests = testAgainstFilter(mutationResults.mutations, filterPattern);
      setFilterResults(filterTests);
    } else {
      setFilterResults(null);
    }
  };

  const handleToggleStrategy = (strategyKey) => {
    setStrategies(prev => ({
      ...prev,
      [strategyKey]: !prev[strategyKey]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(strategies).every(v => v);
    const newState = {};
    Object.keys(strategies).forEach(key => {
      newState[key] = !allSelected;
    });
    setStrategies(newState);
  };

  const handleLoadExample = (exampleKey) => {
    setBasePayload(examples[exampleKey]);
    setResults(null);
    setFilterResults(null);
  };

  const handleClear = () => {
    setBasePayload('');
    setResults(null);
    setFilterResults(null);
    setFilterPattern('');
    setCopiedIndex(null);
  };

  const handleCopyPayload = (payload, index) => {
    copyToClipboard(payload);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExport = (format) => {
    if (!results) return;

    if (format === 'json') {
      const data = JSON.stringify({
        base: basePayload,
        strategies: results.strategies,
        mutations: results.mutations,
        total: results.total,
        generated: new Date().toISOString()
      }, null, 2);

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payload-mutations.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'text') {
      const data = results.mutations
        .map(m => `[${m.strategy}] ${m.payload}`)
        .join('\n');

      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'payload-mutations.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Calculate stats
  const bypassCount = filterResults
    ? filterResults.filter(r => !r.blocked).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Base Payload Input */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Base Payload</h3>
        <textarea
          value={basePayload}
          onChange={(e) => setBasePayload(e.target.value)}
          placeholder="Enter your base XSS payload..."
          className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
        />
        <div className="text-sm text-gray-500 mt-2">
          {basePayload.length} characters
        </div>

        {/* Example Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleLoadExample('basic')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            Basic Script
          </button>
          <button
            onClick={() => handleLoadExample('eventHandler')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            Event Handler
          </button>
          <button
            onClick={() => handleLoadExample('svg')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            SVG
          </button>
          <button
            onClick={() => handleLoadExample('protocol')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            Protocol Handler
          </button>
          <button
            onClick={() => handleLoadExample('iframe')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            Iframe
          </button>
        </div>
      </div>

      {/* Mutation Strategies */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Mutation Strategies</h3>
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {Object.values(strategies).every(v => v) ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(strategies).map(([key, enabled]) => (
            <label
              key={key}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={() => handleToggleStrategy(key)}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {formatStrategyName(key)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Optional Filter Testing */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Filter Testing
          <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
        </h3>
        <input
          type="text"
          value={filterPattern}
          onChange={(e) => setFilterPattern(e.target.value)}
          placeholder="Enter regex pattern or blacklist string (e.g., script|alert|onerror)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
        />
        <p className="text-sm text-gray-500 mt-2">
          Test each mutation against a filter pattern to identify potential bypasses
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate Mutations
        </button>
        <button
          onClick={handleClear}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
        >
          Clear
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-700">{results.total}</div>
              <div className="text-sm text-blue-600 mt-1">Total Variations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-700">{results.strategies.length}</div>
              <div className="text-sm text-purple-600 mt-1">Strategies Used</div>
            </div>
            {filterResults && (
              <>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-700">{bypassCount}</div>
                  <div className="text-sm text-green-600 mt-1">Filter Bypasses</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-700">{results.total - bypassCount}</div>
                  <div className="text-sm text-red-600 mt-1">Blocked</div>
                </div>
              </>
            )}
          </div>

          {/* Export Options */}
          <div className="flex gap-2 mb-6 pb-6 border-b border-gray-200">
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export JSON
            </button>
            <button
              onClick={() => handleExport('text')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Text
            </button>
          </div>

          {/* Payload List */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Generated Payloads</h4>
            <div className="space-y-3">
              {results.mutations.map((mutation, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                        {mutation.strategy}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                        {mutation.encoding}
                      </span>
                      {filterResults && filterResults[idx] && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            filterResults[idx].blocked
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {filterResults[idx].blocked ? '✗ Blocked' : '✓ Bypass'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopyPayload(mutation.payload, idx)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        copiedIndex === idx
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      {copiedIndex === idx ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <code className="block bg-gray-900 text-white p-3 rounded text-sm font-mono break-all">
                    {mutation.payload}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!results && (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Mutations Generated</h3>
          <p className="text-gray-600">
            Enter a base payload, select mutation strategies, and click "Generate Mutations" to begin fuzzing.
          </p>
        </div>
      )}
    </div>
  );
}
