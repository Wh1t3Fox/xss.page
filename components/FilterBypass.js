import { useState } from 'react';
import { filters } from '../data/filters';
import CodeBlock from './CodeBlock';
import ErrorBoundary from './ErrorBoundary';

const bypassExamples = [
  {
    id: 'nested-tags',
    filterType: 'basic',
    originalPayload: '<script>alert(1)</script>',
    bypassPayload: '<scr<script>ipt>alert(1)</scr</script>ipt>',
    explanation: 'If the filter removes <script> tags, nested tags can bypass it. When the inner <script> is removed, the outer parts combine to form a valid script tag.',
    how: 'Filter removes <script>, leaving: <scr ipt>alert(1)</scr ipt> → becomes valid after filter runs once'
  },
  {
    id: 'case-variation',
    filterType: 'blacklist',
    originalPayload: '<img src=x onerror=alert(1)>',
    bypassPayload: '<img src=x OnErRoR=alert(1)>',
    explanation: 'Case-insensitive filters can sometimes be bypassed with mixed case. However, HTML attributes are case-insensitive, so this works.',
    how: 'Filter checks for "onerror" but misses "OnErRoR"'
  },
  {
    id: 'event-encoding',
    filterType: 'blacklist',
    originalPayload: '<img src=x onerror=alert(1)>',
    bypassPayload: '<img src=x onerror=&#97;&#108;&#101;&#114;&#116;(1)>',
    explanation: 'HTML entities in attribute values are decoded by the browser, allowing encoded JavaScript code to execute.',
    how: '&#97;&#108;&#101;&#114;&#116; decodes to "alert"'
  },
  {
    id: 'alternative-events',
    filterType: 'moderate',
    originalPayload: '<img src=x onerror=alert(1)>',
    bypassPayload: '<svg><animate onbegin=alert(1) attributeName=x>',
    explanation: 'If common events like onerror are filtered, use less common events like SVG animate onbegin.',
    how: 'Filter blocks onerror/onload but misses onbegin'
  },
  {
    id: 'whitespace',
    filterType: 'basic',
    originalPayload: '<script>alert(1)</script>',
    bypassPayload: '<script\n>alert(1)</script>',
    explanation: 'Some filters don\'t account for whitespace characters (newlines, tabs) between tag name and attributes.',
    how: 'Filter looks for <script> but misses <script\\n>'
  },
  {
    id: 'null-byte',
    filterType: 'blacklist',
    originalPayload: '<script>alert(1)</script>',
    bypassPayload: '<scri\\x00pt>alert(1)</scri\\x00pt>',
    explanation: 'In some contexts, null bytes or special characters can break pattern matching while being ignored by the browser.',
    how: 'Filter sees "scri\\x00pt", browser may ignore null byte'
  }
];

export default function FilterBypass() {
  const [selectedExample, setSelectedExample] = useState(bypassExamples[0].id);
  const [testPayload, setTestPayload] = useState('');
  const [filterResult, setFilterResult] = useState(null);

  const currentExample = bypassExamples.find(ex => ex.id === selectedExample);

  const handleTest = (payload, filterKey) => {
    const filter = filters[filterKey];
    if (!filter) return;

    const filtered = filter.apply(payload);
    const wouldExecute = /<script|on\w+|javascript:|<svg|<img|<iframe/i.test(filtered);

    setFilterResult({
      original: payload,
      filtered,
      wouldExecute,
      filterName: filter.name
    });
  };

  return (
    <ErrorBoundary>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Filter Bypass Techniques
            </h2>
            <p className="text-gray-600">
              Learn how attackers bypass common XSS filters and how to implement proper defenses.
            </p>
          </div>

          {/* Example Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Bypass Technique
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {bypassExamples.map((example) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(example.id)}
                  className={`p-3 text-left border-2 rounded-lg transition ${
                    selectedExample === example.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-gray-900 capitalize">
                    {example.id.replace(/-/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    vs {filters[example.filterType]?.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Example Details */}
          {currentExample && (
            <div className="space-y-6">
              {/* Explanation */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  How This Bypass Works
                </h3>
                <p className="text-sm text-blue-800 mb-2">
                  {currentExample.explanation}
                </p>
                <p className="text-xs text-blue-700 font-mono">
                  {currentExample.how}
                </p>
              </div>

              {/* Before (Original) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Original Payload (Blocked)
                </h3>
                <CodeBlock code={currentExample.originalPayload} language="html" showCopy={true} />
                <button
                  onClick={() => handleTest(currentExample.originalPayload, currentExample.filterType)}
                  className="mt-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium transition"
                >
                  Test Original Against Filter
                </button>
              </div>

              {/* After (Bypass) */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Bypass Payload (May Work)
                </h3>
                <CodeBlock code={currentExample.bypassPayload} language="html" showCopy={true} />
                <button
                  onClick={() => handleTest(currentExample.bypassPayload, currentExample.filterType)}
                  className="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm font-medium transition"
                >
                  Test Bypass Against Filter
                </button>
              </div>

              {/* Test Results */}
              {filterResult && (
                <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Filter Test Results
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Filter Applied:</div>
                      <div className="text-sm font-semibold text-gray-900">{filterResult.filterName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Input:</div>
                      <code className="text-xs bg-white border border-gray-300 p-2 rounded block overflow-x-auto">
                        {filterResult.original}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">After Filter:</div>
                      <code className="text-xs bg-white border border-gray-300 p-2 rounded block overflow-x-auto">
                        {filterResult.filtered}
                      </code>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Would Execute:</div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        filterResult.wouldExecute
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {filterResult.wouldExecute ? 'Yes (Filter Bypassed)' : 'No (Filter Effective)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Defense */}
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <h3 className="text-sm font-semibold text-green-900 mb-2">
                  Proper Defense
                </h3>
                <p className="text-sm text-green-800">
                  <strong>Don't use blacklist filters!</strong> Instead, use context-aware output encoding:
                </p>
                <ul className="text-sm text-green-800 mt-2 list-disc list-inside space-y-1">
                  <li>HTML context: Encode {"<, >, &, ', \""}</li>
                  <li>JavaScript context: Use JSON.stringify()</li>
                  <li>URL context: Use encodeURIComponent()</li>
                  <li>Implement Content Security Policy (CSP)</li>
                  <li>Use modern frameworks with auto-escaping (React, Vue, Angular)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Educational Note */}
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> These bypass techniques are for educational purposes only.
              Use them only on systems you own or have explicit permission to test.
              The goal is to understand why blacklist filtering is insufficient and why proper encoding is essential.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
