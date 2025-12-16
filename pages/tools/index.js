import Head from 'next/head';
import Layout from '../../components/Layout';
import ToolCard from '../../components/shared/ToolCard';

export default function Tools() {
  const tools = [
    {
      title: 'CSP Analyzer & Builder',
      description: 'Parse and analyze Content Security Policy headers. Test XSS payloads against CSP rules. Build secure policies with framework-specific templates.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      href: '/tools/csp-analyzer',
      status: 'available',
      tags: ['Security Headers', 'XSS Prevention', 'Policy Builder']
    },
    {
      title: 'DOM Sink/Source Analyzer',
      description: 'Scan JavaScript code for dangerous DOM sinks and untrusted sources. Visualize data flow from source to sink. Get remediation advice for vulnerable patterns.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      href: '/tools/dom-analyzer',
      status: 'available',
      tags: ['DOM XSS', 'Code Analysis', 'Static Scanner']
    },
    {
      title: 'Payload Fuzzer',
      description: 'Generate payload variations using mutation strategies. Test against custom filters. Create encoding chains for bypass attempts.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      href: '/tools/fuzzer',
      status: 'available',
      tags: ['Fuzzing', 'Mutations', 'Bypass Testing']
    },
    {
      title: 'XSS Scanner',
      description: 'Automated vulnerability scanner for web applications. Detect reflection points, test parameters, and generate detailed findings reports.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      href: '/tools/scanner',
      status: 'coming',
      tags: ['Automated Testing', 'Vulnerability Detection', 'Reporting']
    },
    {
      title: 'API Documentation',
      description: 'Access the XSS payload database programmatically. Static JSON endpoints for integration with Burp Suite, OWASP ZAP, and custom tools.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/api-docs',
      status: 'available',
      tags: ['API', 'Integration', 'JSON']
    },
    {
      title: 'Learning Paths',
      description: 'Structured tutorials from beginner to advanced. Hands-on challenges with instant feedback. Track your progress through interactive lessons.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      href: '/learn',
      status: 'available',
      tags: ['Tutorials', 'Challenges', 'Education']
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Developer Tools - XSS.page</title>
        <meta
          name="description"
          content="Professional XSS security tools for developers and security researchers. CSP analyzer, DOM scanner, payload fuzzer, and more."
        />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Developer Tools
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Professional-grade security tools for testing, analyzing, and preventing XSS vulnerabilities.
            Built for developers and security researchers.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                <strong className="font-semibold">For authorized testing only.</strong>
                {' '}These tools are designed for educational purposes and authorized security testing.
                Only use on systems you own or have explicit permission to test. Unauthorized access is illegal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Tools</h2>
          <p className="text-gray-600">
            Choose a tool below to get started. More tools are being added regularly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Interactive Playground
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Test XSS payloads in a safe environment with multiple testing modes.
            </p>
            <a href="/playground" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Go to Playground →
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Payload Database
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Browse 150+ categorized XSS payloads with detailed descriptions.
            </p>
            <a href="/payloads" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View Payloads →
            </a>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learning Resources
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Comprehensive guides on XSS types, prevention, and best practices.
            </p>
            <a href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Start Learning →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
