import { useState } from 'react';
import { scanCode, detectFramework, calculateRiskScore, getRemediationAdvice } from '../../utils/dom-scanner';
import { frameworks } from '../../data/dom-patterns';
import CodeBlock from '../CodeBlock';

export default function DOMAnalyzer() {
  const [code, setCode] = useState('');
  const [framework, setFramework] = useState('auto');
  const [scanResults, setScanResults] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);

  const handleScan = () => {
    if (!code.trim()) return;

    // Auto-detect framework if set to auto
    const detectedFramework = framework === 'auto' ? detectFramework(code) : framework;

    // Scan the code
    const results = scanCode(code, detectedFramework);

    // Calculate risk score
    const risk = calculateRiskScore(results);

    setScanResults(results);
    setRiskScore(risk);
    setSelectedFinding(null);
  };

  const handleClear = () => {
    setCode('');
    setScanResults(null);
    setRiskScore(null);
    setSelectedFinding(null);
  };

  const loadExample = (exampleCode) => {
    setCode(exampleCode);
    setScanResults(null);
    setRiskScore(null);
  };

  const examples = {
    vulnerable: `// Vulnerable code example
const username = location.hash.substring(1);
document.getElementById('welcome').innerHTML = 'Hello ' + username;

const search = new URLSearchParams(location.search).get('q');
eval('search_' + search + '()');`,

    react: `// React vulnerable example
function UserProfile({ userId }) {
  const [bio, setBio] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    setBio(hash);
  }, []);

  return <div dangerouslySetInnerHTML={{__html: bio}} />;
}`,

    safe: `// Safe code example
const username = location.hash.substring(1);
document.getElementById('welcome').textContent = 'Hello ' + username;

const search = new URLSearchParams(location.search).get('q');
if (search === 'users') {
  search_users();
}`
  };

  return (
    <div className="space-y-6">
      {/* Code Input Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Analyze Code for DOM XSS</h2>

          {/* Framework Selector */}
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="auto">Auto-detect Framework</option>
            <option value="vanilla">Vanilla JavaScript</option>
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="angular">Angular</option>
            <option value="jquery">jQuery</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-2">
              Paste your JavaScript, HTML, or framework code
            </label>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Paste your code here..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              rows={12}
            />
            <p className="mt-2 text-sm text-gray-600">
              {code.length} characters
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleScan}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Scan for Vulnerabilities
            </button>
            {scanResults && (
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}

            {/* Example buttons */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => loadExample(examples.vulnerable)}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition"
              >
                Load Vulnerable Example
              </button>
              <button
                onClick={() => loadExample(examples.react)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition"
              >
                Load React Example
              </button>
              <button
                onClick={() => loadExample(examples.safe)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition"
              >
                Load Safe Example
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Score */}
      {riskScore && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h3>

          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold ${
                riskScore.level === 'critical' ? 'bg-red-100 text-red-700' :
                riskScore.level === 'high' ? 'bg-orange-100 text-orange-700' :
                riskScore.level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {riskScore.score}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-2xl font-semibold ${
                  riskScore.level === 'critical' ? 'text-red-700' :
                  riskScore.level === 'high' ? 'text-orange-700' :
                  riskScore.level === 'medium' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  {riskScore.level.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{riskScore.description}</p>

              {scanResults && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Findings:</span>
                    <span className="ml-2 text-gray-700">{scanResults.summary.totalFindings}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Dangerous Sinks:</span>
                    <span className="ml-2 text-gray-700">{scanResults.summary.sinkCount}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Data Flows:</span>
                    <span className="ml-2 text-gray-700">{scanResults.summary.dataFlowCount}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Flow Diagram */}
      {scanResults && scanResults.dataFlows.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            ⚠️ Detected Data Flows (Source → Sink)
          </h3>
          <p className="text-gray-600 mb-4">
            These show potential paths where untrusted data flows into dangerous sinks
          </p>

          <div className="space-y-3">
            {scanResults.dataFlows.map((flow, index) => (
              <div
                key={index}
                className="bg-red-50 border-l-4 border-red-400 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-mono">
                      {flow.source}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-mono">
                      {flow.sink}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    flow.confidence === 'high' ? 'bg-red-100 text-red-700' :
                    flow.confidence === 'medium' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {flow.confidence} confidence
                  </span>
                </div>
                <p className="text-sm text-red-800">
                  {flow.description} (lines {flow.sourceLine} → {flow.sinkLine})
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Findings */}
      {scanResults && scanResults.findings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Detailed Findings ({scanResults.findings.length})
          </h3>

          <div className="space-y-3">
            {scanResults.findings.map((finding, index) => (
              <div
                key={index}
                className={`border-l-4 p-4 rounded cursor-pointer transition ${
                  selectedFinding === index
                    ? 'bg-primary-50 border-primary-500'
                    : finding.severity === 'critical'
                    ? 'bg-red-50 border-red-400 hover:bg-red-100'
                    : finding.severity === 'high'
                    ? 'bg-orange-50 border-orange-400 hover:bg-orange-100'
                    : 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100'
                }`}
                onClick={() => setSelectedFinding(selectedFinding === index ? null : index)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-semibold text-gray-900">
                        {finding.name}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        finding.severity === 'critical' ? 'bg-red-600 text-white' :
                        finding.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {finding.severity}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                        {finding.type}
                      </span>
                      {finding.cwe && (
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
                          {finding.cwe}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{finding.description}</p>
                    <code className="block bg-gray-100 px-3 py-2 rounded text-sm text-gray-800 overflow-x-auto">
                      Line {finding.line}: {finding.snippet}
                    </code>
                  </div>

                  <button className="text-gray-400 hover:text-gray-600 ml-4">
                    <svg className={`w-5 h-5 transition-transform ${selectedFinding === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Expanded details */}
                {selectedFinding === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Safe Alternative:</h4>
                        <p className="text-sm text-gray-700">{finding.safeAlternative}</p>
                      </div>

                      {finding.type === 'sink' && (
                        <RemediationAdvice finding={finding} />
                      )}

                      {finding.validation && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Required Validation:</h4>
                          <p className="text-sm text-gray-700">{finding.validation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Known Patterns */}
      {scanResults && scanResults.knownPatterns.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Known Vulnerability Patterns
          </h3>

          <div className="space-y-3">
            {scanResults.knownPatterns.map((pattern, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    pattern.severity === 'critical' ? 'bg-red-600 text-white' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {pattern.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{pattern.description}</p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-1">Fix:</p>
                  <p className="text-gray-700">{pattern.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No findings */}
      {scanResults && scanResults.findings.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-green-900">No obvious vulnerabilities detected!</h3>
              <p className="text-sm text-green-700">
                The code looks safe, but always test thoroughly and follow security best practices.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for showing remediation advice
function RemediationAdvice({ finding }) {
  const advice = getRemediationAdvice(finding);

  if (!advice || !advice.alternatives || advice.alternatives.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="font-semibold text-gray-900 mb-2">{advice.title}</h4>
      <div className="space-y-2">
        {advice.alternatives.map((alt, index) => (
          <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-1">
              <span className="font-medium text-gray-900">{alt.name}</span>
              <span className="text-xs text-gray-600">{alt.when}</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">{alt.description}</p>
            {alt.example && (
              <code className="block bg-gray-50 px-2 py-1 rounded text-xs text-gray-800 overflow-x-auto">
                {alt.example}
              </code>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
