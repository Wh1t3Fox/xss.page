import { useState } from 'react';
import { generateMutations, testAgainstFilter, formatStrategyName } from '../../utils/payload-fuzzer.mjs';
import { copyToClipboard } from '../../utils/clipboard';

export default function PayloadFuzzer() {
  // State management
  const [mode, setMode] = useState('mutation'); // 'mutation' or 'generation'
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
  const [limit, setLimit] = useState(100);
  const [generationCount, setGenerationCount] = useState(20);
  const [results, setResults] = useState(null);
  const [filterResults, setFilterResults] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  // Example payloads
  const examples = {
    basic: '<script>alert(1)</script>',
    eventHandler: '<img src=x onerror=alert(1)>',
    svg: '<svg/onload=alert(1)>',
    protocol: 'javascript:alert(1)',
    iframe: '<iframe src="javascript:alert(1)">',
  };

  // Event handlers
  const handleGenerate = async () => {
    // Validation based on mode
    if (mode === 'mutation') {
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
    }

    setLoading(true);
    setResults(null);
    setFilterResults(null);

    try {
      // Build selected strategies array
      const selectedStrategies = Object.entries(strategies)
        .filter(([_, enabled]) => enabled)
        .map(([key, _]) => key);

      // Build request body based on mode
      let requestBody;
      if (mode === 'mutation') {
        const limitValue = Math.max(1, Math.min(parseInt(limit) || 100, 500));
        requestBody = {
          payload: basePayload,
          strategies: selectedStrategies,
          limit: limitValue
        };
      } else {
        // Generation mode
        const countValue = Math.max(1, Math.min(parseInt(generationCount) || 20, 500));
        requestBody = {
          limit: countValue
        };

        // Only include strategies if at least one is selected
        const hasStrategy = Object.values(strategies).some(v => v);
        if (hasStrategy) {
          requestBody.strategies = selectedStrategies;
        }
      }

      // Call API endpoint
      const response = await fetch('/api/fuzz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data);

      // Apply filter testing if pattern is provided
      if (filterPattern && filterPattern.trim()) {
        const payloads = mode === 'mutation' ? data.mutations : data.payloads;
        const filterTests = testAgainstFilter(
          payloads.map(p => ({ payload: p.payload })),
          filterPattern
        );
        setFilterResults(filterTests);
      }

    } catch (error) {
      console.error('Error generating payloads:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
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

    const payloadList = results.mode === 'mutation' ? results.mutations : results.payloads;

    if (format === 'json') {
      const data = JSON.stringify({
        mode: results.mode,
        ...(results.mode === 'mutation' && { base: basePayload }),
        ...(results.strategies && { strategies: results.strategies }),
        ...(results.mutationsApplied !== undefined && { mutationsApplied: results.mutationsApplied }),
        [results.mode === 'mutation' ? 'mutations' : 'payloads']: payloadList,
        total: results.total,
        returned: results.returned,
        generated: new Date().toISOString()
      }, null, 2);

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = results.mode === 'mutation' ? 'payload-mutations.json' : 'generated-payloads.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'text') {
      const data = payloadList
        .map(item => {
          if (results.mode === 'mutation') {
            return `[${item.strategy}] ${item.payload}`;
          } else {
            return `[${item.category}/${item.technique}] ${item.payload}`;
          }
        })
        .join('\n');

      const blob = new Blob([data], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = results.mode === 'mutation' ? 'payload-mutations.txt' : 'generated-payloads.txt';
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
      {/* Mode Selector */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Fuzzer Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('mutation')}
            className={`p-4 rounded-lg border-2 transition text-left ${
              mode === 'mutation'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                mode === 'mutation' ? 'border-primary-500' : 'border-gray-300'
              }`}>
                {mode === 'mutation' && (
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                )}
              </div>
              <span className="font-semibold text-gray-900">Mutation Mode</span>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              Provide a base payload and mutate it using encoding and obfuscation strategies
            </p>
          </button>
          <button
            onClick={() => setMode('generation')}
            className={`p-4 rounded-lg border-2 transition text-left ${
              mode === 'generation'
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                mode === 'generation' ? 'border-primary-500' : 'border-gray-300'
              }`}>
                {mode === 'generation' && (
                  <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                )}
              </div>
              <span className="font-semibold text-gray-900">Generation Mode</span>
            </div>
            <p className="text-sm text-gray-600 ml-8">
              Generate arbitrary XSS payloads from templates with optional mutations
            </p>
          </button>
        </div>
      </div>

      {/* Base Payload Input (Mutation Mode Only) */}
      {mode === 'mutation' && (
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
      )}

      {/* Generation Mode Configuration */}
      {mode === 'generation' && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Generation Settings</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Payloads to Generate
              </label>
              <input
                type="number"
                value={generationCount}
                onChange={(e) => setGenerationCount(e.target.value)}
                min="1"
                max="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div className="flex-shrink-0 pt-6">
              <span className="text-sm text-gray-600">
                Max: 500 payloads
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Generate arbitrary XSS payloads from weighted templates (event handlers, script tags, SVG, protocol handlers, etc.)
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setGenerationCount(10)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
            >
              10
            </button>
            <button
              onClick={() => setGenerationCount(20)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
            >
              20
            </button>
            <button
              onClick={() => setGenerationCount(50)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
            >
              50
            </button>
            <button
              onClick={() => setGenerationCount(100)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
            >
              100
            </button>
          </div>
        </div>
      )}

      {/* Mutation Strategies */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Mutation Strategies
            {mode === 'generation' && (
              <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
            )}
          </h3>
          <button
            onClick={handleSelectAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {Object.values(strategies).every(v => v) ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        {mode === 'generation' && (
          <p className="text-sm text-gray-600 mb-4">
            Optionally apply mutation strategies to generated payloads for additional variations
          </p>
        )}

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

      {/* Result Limit (Mutation Mode Only) */}
      {mode === 'mutation' && (
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Result Limit</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              min="1"
              max="500"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>
          <div className="flex-shrink-0">
            <span className="text-sm text-gray-600">
              Max: 500 mutations
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Limit the number of mutations displayed (1-500). Default: 100.
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setLimit(10)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            10
          </button>
          <button
            onClick={() => setLimit(50)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            50
          </button>
          <button
            onClick={() => setLimit(100)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            100
          </button>
          <button
            onClick={() => setLimit(500)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
          >
            All (500)
          </button>
        </div>
      </div>
      )}

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
          disabled={loading}
          className={`px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition flex items-center ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {mode === 'mutation' ? 'Generate Mutations' : 'Generate Payloads'}
            </>
          )}
        </button>
        <button
          onClick={handleClear}
          disabled={loading}
          className={`px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
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
              <div className="text-sm text-blue-600 mt-1">Total Generated</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-700">{results.returned}</div>
              <div className="text-sm text-indigo-600 mt-1">Displayed</div>
            </div>
            {results.mode === 'mutation' && results.strategies && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">{results.strategies.length}</div>
                <div className="text-sm text-purple-600 mt-1">Strategies Used</div>
              </div>
            )}
            {results.mode === 'generation' && (
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">
                  {results.mutationsApplied ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-purple-600 mt-1">Mutations Applied</div>
              </div>
            )}
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
            <h4 className="text-lg font-bold text-gray-900 mb-4">
              {results.mode === 'mutation' ? 'Mutated Payloads' : 'Generated Payloads'}
            </h4>
            <div className="space-y-3">
              {(results.mode === 'mutation' ? results.mutations : results.payloads).map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-wrap gap-2">
                      {results.mode === 'mutation' ? (
                        <>
                          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                            {item.strategy}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {item.encoding}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {item.category}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {item.technique}
                          </span>
                          {item.mutated && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                              Mutated: {item.mutationStrategy}
                            </span>
                          )}
                        </>
                      )}
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
                      onClick={() => handleCopyPayload(item.payload, idx)}
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
                    {item.payload}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {mode === 'mutation' ? 'No Mutations Generated' : 'No Payloads Generated'}
          </h3>
          <p className="text-gray-600">
            {mode === 'mutation'
              ? 'Enter a base payload, select mutation strategies, and click "Generate Mutations" to begin fuzzing.'
              : 'Configure generation settings and click "Generate Payloads" to create arbitrary XSS payloads from templates.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
