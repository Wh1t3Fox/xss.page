import Head from 'next/head';
import Layout from '../../components/Layout';
import DOMAnalyzer from '../../components/tools/DOMAnalyzer';
import { frameworks } from '../../data/dom-patterns';

export default function DOMAnalyzerPage() {
  return (
    <Layout>
      <Head>
        <title>DOM Sink/Source Analyzer - XSS.page</title>
        <meta
          name="description"
          content="Scan JavaScript code for dangerous DOM sinks and untrusted sources. Detect DOM-based XSS vulnerabilities with framework-specific analysis."
        />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DOM Sink/Source Analyzer
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Scan JavaScript code for dangerous DOM sinks and untrusted sources.
            Visualize data flows and get remediation advice for DOM-based XSS vulnerabilities.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What is DOM XSS */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What is DOM-based XSS?
              </h3>
              <p className="text-blue-800 mb-2">
                DOM-based XSS occurs when untrusted data from sources (like URL parameters, localStorage, or postMessage)
                flows into dangerous sinks (like innerHTML, eval, or location.href) without proper validation or sanitization.
              </p>
              <p className="text-blue-800">
                <strong>Why it matters:</strong> Unlike reflected or stored XSS, DOM XSS happens entirely in the browser,
                making it harder to detect with traditional server-side security tools. This analyzer helps you find these
                vulnerabilities before they reach production.
              </p>
            </div>
          </div>
        </div>

        {/* Main Tool */}
        <DOMAnalyzer />

        {/* Framework Best Practices */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Framework Security Best Practices</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(frameworks).map(([key, framework]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{framework.name}</h4>

                <div className="mb-3">
                  <p className="text-sm font-semibold text-green-700 mb-2">✓ Safe Practices:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {framework.safePractices.map((practice, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-700 mb-2">✗ Avoid:</p>
                  <div className="flex flex-wrap gap-2">
                    {framework.dangerousPatterns.map((pattern, index) => (
                      <code key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">
                        {pattern}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn More About DOM XSS
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://portswigger.net/web-security/cross-site-scripting/dom-based" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  PortSwigger: DOM-based XSS →
                </a>
              </li>
              <li>
                <a href="https://owasp.org/www-community/attacks/DOM_Based_XSS" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  OWASP: DOM-based XSS →
                </a>
              </li>
              <li>
                <a href="https://github.com/cure53/DOMPurify" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  DOMPurify - HTML Sanitizer →
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              More Tools
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/tools/csp-analyzer" className="text-primary-600 hover:text-primary-700">
                  CSP Analyzer - Build security policies →
                </a>
              </li>
              <li>
                <a href="/playground" className="text-primary-600 hover:text-primary-700">
                  Interactive Playground - Test payloads →
                </a>
              </li>
              <li>
                <a href="/tools" className="text-primary-600 hover:text-primary-700">
                  All Developer Tools →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
