import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboard';

/**
 * Code block component with syntax highlighting and copy functionality
 * @param {string} code - The code to display
 * @param {string} language - Programming language (html, javascript, css)
 * @param {boolean} showCopy - Whether to show copy button (default: true)
 */
export default function CodeBlock({ code, language = 'html', showCopy = true }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group">
      <div className="bg-gray-900 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            {language}
          </span>
          {showCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition"
              aria-label="Copy code to clipboard"
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
          )}
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm text-gray-100 font-mono">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
