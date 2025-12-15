import { useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import CSPAnalyzer from '../../components/tools/CSPAnalyzer';
import CSPBuilder from '../../components/tools/CSPBuilder';
import TabNavigation from '../../components/TabNavigation';
import { cspTemplates } from '../../data/csp-directives';

export default function CSPAnalyzerPage() {
  const [activeTab, setActiveTab] = useState('analyzer');

  const tabs = [
    { id: 'analyzer', label: 'Analyzer' },
    { id: 'builder', label: 'Builder' }
  ];

  return (
    <Layout>
      <Head>
        <title>CSP Analyzer & Builder - XSS.page</title>
        <meta
          name="description"
          content="Analyze and build Content Security Policy headers. Test XSS payloads against CSP rules. Generate secure policies for your web application."
        />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CSP Analyzer & Builder
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Parse and analyze Content Security Policy headers. Test XSS payloads against CSP rules.
            Build secure policies with framework-specific templates.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* What is CSP */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What is Content Security Policy (CSP)?
              </h3>
              <p className="text-blue-800 mb-2">
                Content Security Policy (CSP) is a security standard that helps prevent Cross-Site Scripting (XSS),
                clickjacking, and other code injection attacks. It works by allowing you to specify which sources
                of content are trusted for your web application.
              </p>
              <p className="text-blue-800">
                <strong>Why it matters:</strong> A properly configured CSP can block malicious scripts even if an
                XSS vulnerability exists in your code. It's one of the most effective defenses against XSS attacks.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'analyzer' && <CSPAnalyzer />}
        {activeTab === 'builder' && <CSPBuilder />}

        {/* Quick Examples */}
        <div className="mt-12 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">CSP Policy Templates</h3>
          <p className="text-gray-600 mb-6">
            Common CSP configurations for different security levels. Click to copy and test.
          </p>

          <div className="space-y-4">
            {Object.entries(cspTemplates).map(([key, template]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(template.policy)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition"
                  >
                    Copy
                  </button>
                </div>

                <code className="block bg-gray-50 p-3 rounded text-xs text-gray-800 overflow-x-auto mb-3">
                  {template.policy}
                </code>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-green-700 mb-1">Pros:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {template.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-red-700 mb-1">Cons:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {template.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
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
              Learn More About CSP
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  MDN Web Docs: Content Security Policy →
                </a>
              </li>
              <li>
                <a href="https://content-security-policy.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  CSP Quick Reference Guide →
                </a>
              </li>
              <li>
                <a href="https://csp-evaluator.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                  Google CSP Evaluator →
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
                <a href="/playground" className="text-primary-600 hover:text-primary-700">
                  Interactive Playground - Test payloads live →
                </a>
              </li>
              <li>
                <a href="/payloads" className="text-primary-600 hover:text-primary-700">
                  Payload Database - 150+ XSS payloads →
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
