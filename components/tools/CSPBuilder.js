import { useState, useEffect } from 'react';
import { cspDirectives, validSources, cspTemplates, directivesByCategory } from '../../data/csp-directives';
import { generateCSP, parseCSP, calculateSecurityScore } from '../../utils/csp-parser';
import CodeBlock from '../CodeBlock';

export default function CSPBuilder() {
  // State for selected directives and their values
  const [selectedDirectives, setSelectedDirectives] = useState({
    'default-src': ["'self'"],
    'script-src': ["'self'"],
    'style-src': ["'self'", "'unsafe-inline'"]
  });

  const [generatedPolicy, setGeneratedPolicy] = useState('');
  const [securityScore, setSecurityScore] = useState(null);
  const [activeCategory, setActiveCategory] = useState('fetch');
  const [showAddDirective, setShowAddDirective] = useState(false);

  // Generate policy whenever selections change
  useEffect(() => {
    const policy = generateCSP(selectedDirectives);
    setGeneratedPolicy(policy);

    // Calculate security score
    if (policy) {
      const parsed = parseCSP(policy);
      const score = calculateSecurityScore(parsed);
      setSecurityScore(score);
    }
  }, [selectedDirectives]);

  const addDirective = (directiveName) => {
    if (!selectedDirectives[directiveName]) {
      setSelectedDirectives({
        ...selectedDirectives,
        [directiveName]: ["'self'"]
      });
    }
    setShowAddDirective(false);
  };

  const removeDirective = (directiveName) => {
    const newDirectives = { ...selectedDirectives };
    delete newDirectives[directiveName];
    setSelectedDirectives(newDirectives);
  };

  const addSourceValue = (directiveName, value) => {
    const currentValues = selectedDirectives[directiveName] || [];
    if (!currentValues.includes(value)) {
      setSelectedDirectives({
        ...selectedDirectives,
        [directiveName]: [...currentValues, value]
      });
    }
  };

  const removeSourceValue = (directiveName, value) => {
    const currentValues = selectedDirectives[directiveName] || [];
    setSelectedDirectives({
      ...selectedDirectives,
      [directiveName]: currentValues.filter(v => v !== value)
    });
  };

  const addCustomSource = (directiveName, customValue) => {
    if (customValue.trim()) {
      addSourceValue(directiveName, customValue.trim());
    }
  };

  const loadTemplate = (templateKey) => {
    const template = cspTemplates[templateKey];
    if (template) {
      const parsed = parseCSP(template.policy);
      const newDirectives = {};

      Object.entries(parsed.directives).forEach(([name, directive]) => {
        newDirectives[name] = directive.values;
      });

      setSelectedDirectives(newDirectives);
    }
  };

  const clearAll = () => {
    setSelectedDirectives({});
  };

  const exportPolicy = (format) => {
    if (format === 'header') {
      return generatedPolicy;
    } else if (format === 'meta') {
      return `<meta http-equiv="Content-Security-Policy" content="${generatedPolicy}">`;
    } else if (format === 'nextjs') {
      return `// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: '${generatedPolicy}'
          }
        ]
      }
    ]
  }
}`;
    } else if (format === 'htaccess') {
      return `# .htaccess
Header set Content-Security-Policy "${generatedPolicy}"`;
    } else if (format === 'nginx') {
      return `# nginx.conf
add_header Content-Security-Policy "${generatedPolicy}";`;
    } else if (format === 'apache') {
      return `# apache.conf
Header always set Content-Security-Policy "${generatedPolicy}"`;
    }
    return generatedPolicy;
  };

  const copyToClipboard = (format) => {
    const content = exportPolicy(format);
    navigator.clipboard.writeText(content);
  };

  const availableDirectives = Object.keys(cspDirectives).filter(
    name => !selectedDirectives[name]
  );

  const commonSources = [
    { value: "'self'", label: "'self' - Same origin" },
    { value: "'none'", label: "'none' - Block all" },
    { value: "'unsafe-inline'", label: "'unsafe-inline' - Allow inline (⚠️ Not recommended)" },
    { value: "'unsafe-eval'", label: "'unsafe-eval' - Allow eval() (⚠️ Not recommended)" },
    { value: "https:", label: "https: - Any HTTPS source" },
    { value: "data:", label: "data: - Data URIs" },
    { value: "blob:", label: "blob: - Blob URIs" }
  ];

  return (
    <div className="space-y-6">
      {/* Templates Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Start Templates</h3>
        <p className="text-gray-600 mb-4">
          Load a pre-configured template to get started quickly
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(cspTemplates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => loadTemplate(key)}
              className="text-left p-4 rounded-lg border-2 border-gray-200 hover:border-primary-500 transition"
            >
              <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
              <p className="text-xs text-gray-600">{template.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Security Score */}
      {securityScore && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Security Score</h3>
              <p className="text-sm text-gray-600">Current policy strength</p>
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold ${
              securityScore.color === 'green' ? 'bg-green-100 text-green-700' :
              securityScore.color === 'blue' ? 'bg-blue-100 text-blue-700' :
              securityScore.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
              securityScore.color === 'orange' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {securityScore.score}
            </div>
          </div>
        </div>
      )}

      {/* Directive Builder */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Build Your Policy</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddDirective(!showAddDirective)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition text-sm"
            >
              + Add Directive
            </button>
            {Object.keys(selectedDirectives).length > 0 && (
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition text-sm"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Add Directive Dropdown */}
        {showAddDirective && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Select Directive to Add</h4>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['fetch', 'document', 'navigation', 'reporting', 'other'].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    activeCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Available directives in category */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {directivesByCategory[activeCategory]
                .filter(name => !selectedDirectives[name])
                .map(name => (
                  <button
                    key={name}
                    onClick={() => addDirective(name)}
                    className="text-left p-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition"
                  >
                    <div className="font-mono text-sm font-semibold text-gray-900">{name}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {cspDirectives[name]?.description.substring(0, 50)}...
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Selected Directives */}
        {Object.keys(selectedDirectives).length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No directives selected. Click "Add Directive" to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(selectedDirectives).map(([directiveName, values]) => (
              <DirectiveEditor
                key={directiveName}
                directiveName={directiveName}
                values={values}
                commonSources={commonSources}
                onAddSource={(value) => addSourceValue(directiveName, value)}
                onRemoveSource={(value) => removeSourceValue(directiveName, value)}
                onAddCustomSource={(value) => addCustomSource(directiveName, value)}
                onRemove={() => removeDirective(directiveName)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Generated Policy */}
      {generatedPolicy && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Generated Policy</h3>

          <div className="mb-4">
            <CodeBlock code={generatedPolicy} language="text" showCopy={true} />
          </div>

          {/* Export Options */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3">Export Formats</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { format: 'header', label: 'HTTP Header' },
                { format: 'meta', label: 'HTML Meta Tag' },
                { format: 'nextjs', label: 'Next.js Config' },
                { format: 'htaccess', label: '.htaccess' },
                { format: 'nginx', label: 'Nginx' },
                { format: 'apache', label: 'Apache' }
              ].map(({ format, label }) => (
                <button
                  key={format}
                  onClick={() => copyToClipboard(format)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition text-sm flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Separate component for editing individual directives
function DirectiveEditor({ directiveName, values, commonSources, onAddSource, onRemoveSource, onAddCustomSource, onRemove }) {
  const [customValue, setCustomValue] = useState('');
  const [showSourcePicker, setShowSourcePicker] = useState(false);

  const directive = cspDirectives[directiveName];

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onAddCustomSource(customValue);
      setCustomValue('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-mono font-semibold text-gray-900">{directiveName}</h4>
            {directive?.xssImpact === 'critical' && (
              <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 font-semibold">
                Critical for XSS
              </span>
            )}
          </div>
          {directive && (
            <p className="text-sm text-gray-600">{directive.description}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-red-600 hover:text-red-700 p-1"
          title="Remove directive"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Current values */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-mono ${
                value === "'unsafe-inline'" || value === "'unsafe-eval'" || value === '*'
                  ? 'bg-red-100 text-red-700'
                  : value.startsWith("'nonce-") || value.startsWith("'sha")
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {value}
              <button
                onClick={() => onRemoveSource(value)}
                className="ml-2 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Add source */}
      <div className="space-y-2">
        <button
          onClick={() => setShowSourcePicker(!showSourcePicker)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          + Add Source
        </button>

        {showSourcePicker && (
          <div className="p-3 bg-gray-50 rounded-lg space-y-3">
            {/* Common sources */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Common Sources:</p>
              <div className="flex flex-wrap gap-2">
                {commonSources.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => onAddSource(value)}
                    disabled={values.includes(value)}
                    className={`px-3 py-1 rounded text-sm font-mono ${
                      values.includes(value)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 hover:border-primary-500 text-gray-700'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom source */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Custom Source:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                  placeholder="e.g., https://cdn.example.com"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={handleAddCustom}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
