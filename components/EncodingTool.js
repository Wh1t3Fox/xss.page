import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';
import ErrorBoundary from './ErrorBoundary';

const MAX_INPUT_LENGTH = 10000;

const encodings = {
  htmlEntities: {
    name: 'HTML Entities',
    encode: (str) => str.replace(/[<>"'&]/g, (c) => `&#${c.charCodeAt(0)};`),
    decode: (str) => {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = str;
      return textarea.value;
    }
  },
  url: {
    name: 'URL Encoding',
    encode: (str) => encodeURIComponent(str),
    decode: (str) => {
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return 'Invalid URL encoding';
      }
    }
  },
  unicode: {
    name: 'Unicode Escape',
    encode: (str) => str.split('').map(c => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`).join(''),
    decode: (str) => {
      try {
        return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) =>
          String.fromCharCode(parseInt(code, 16))
        );
      } catch (e) {
        return 'Invalid Unicode escape';
      }
    }
  },
  hex: {
    name: 'Hex Escape',
    encode: (str) => str.split('').map(c => `\\x${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''),
    decode: (str) => {
      try {
        return str.replace(/\\x([0-9a-fA-F]{2})/g, (match, code) =>
          String.fromCharCode(parseInt(code, 16))
        );
      } catch (e) {
        return 'Invalid Hex escape';
      }
    }
  },
  base64: {
    name: 'Base64',
    encode: (str) => btoa(str),
    decode: (str) => {
      try {
        return atob(str);
      } catch (e) {
        return 'Invalid Base64';
      }
    }
  }
};

export default function EncodingTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('encode');
  const [encoding, setEncoding] = useState('htmlEntities');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (input.length > MAX_INPUT_LENGTH) {
      setOutput(`Error: Input too large. Maximum ${MAX_INPUT_LENGTH} characters.`);
      return;
    }

    const encoder = encodings[encoding];
    if (!encoder) {
      setOutput('Invalid encoding selected');
      return;
    }

    try {
      const result = mode === 'encode' ? encoder.encode(input) : encoder.decode(input);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Encoding & Decoding Tool
            </h2>
            <p className="text-gray-600">
              Encode and decode payloads for different contexts. Useful for bypassing filters and understanding encoding mechanisms.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="encode">Encode</option>
                <option value="decode">Decode</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Encoding Type
              </label>
              <select
                value={encoding}
                onChange={(e) => setEncoding(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(encodings).map(([key, { name }]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter text to ${mode}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm"
              rows={6}
              maxLength={MAX_INPUT_LENGTH}
            />
            <p className="mt-1 text-xs text-gray-500">
              {input.length} / {MAX_INPUT_LENGTH} characters
            </p>
          </div>

          {/* Process Button */}
          <div className="mb-4">
            <button
              onClick={handleProcess}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
          </div>

          {/* Output */}
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Output
                </label>
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                <pre className="text-sm text-gray-900 font-mono whitespace-pre-wrap break-all">
                  {output}
                </pre>
              </div>
            </div>
          )}

          {/* Educational Note */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-sm text-blue-700">
              <strong>Educational Note:</strong> Different encoding types are used in different contexts.
              HTML entities for HTML content, URL encoding for URLs, Base64 for data transport, etc.
              Understanding encoding is crucial for both exploiting and preventing XSS vulnerabilities.
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
