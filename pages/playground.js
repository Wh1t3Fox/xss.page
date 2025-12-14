import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/Layout';
import TabNavigation from '../components/TabNavigation';
import PayloadTester from '../components/PayloadTester';
import PayloadBuilder from '../components/PayloadBuilder';
import EncodingTool from '../components/EncodingTool';
import XSSDemo from '../components/XSSDemo';
import FilterBypass from '../components/FilterBypass';

export default function Playground() {
  const tabs = [
    {
      id: 'payload-tester',
      label: 'Payload Tester',
      content: <PayloadTester />
    },
    {
      id: 'payload-builder',
      label: 'Payload Builder',
      content: <PayloadBuilder />
    },
    {
      id: 'encoding-tools',
      label: 'Encoding Tools',
      content: <EncodingTool />
    },
    {
      id: 'live-demos',
      label: 'Live Demos',
      content: <XSSDemo />
    },
    {
      id: 'filter-bypasses',
      label: 'Filter Bypasses',
      content: <FilterBypass />
    }
  ];

  return (
    <Layout>
      <Head>
        <title>XSS Playground - Interactive Tools - XSS.page</title>
        <meta name="description" content="Interactive XSS learning playground with payload testing, building, and encoding tools" />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            XSS Playground
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Interactive tools for learning and testing XSS techniques in a safe environment
          </p>

          {/* Warning Banner */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong className="font-semibold">For educational and authorized testing purposes only.</strong>
                  {' '}Unauthorized access to computer systems is illegal. Use these tools only on systems you own or have explicit permission to test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TabNavigation tabs={tabs} defaultTab="payload-tester" />

        {/* Additional Resources */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Need More Payloads?
          </h3>
          <p className="text-blue-800 mb-4">
            Check out our comprehensive payload cheat sheet with 50+ XSS examples organized by technique and context.
          </p>
          <Link
            href="/payloads"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
          >
            View Payload Cheat Sheet
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Ethical Use Guidelines */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ethical Use Guidelines
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Use these tools for learning, authorized penetration testing, and bug bounty programs</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Always obtain explicit permission before testing on any system you don't own</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Practice responsible disclosure when you find vulnerabilities</p>
            </div>
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p>Learn about XSS to build better, more secure applications</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Resources for Responsible Security Testing:</strong>
            </p>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• <a href="https://www.bugcrowd.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Bugcrowd</a> - Bug bounty platform</li>
              <li>• <a href="https://www.hackerone.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">HackerOne</a> - Vulnerability coordination platform</li>
              <li>• <a href="https://owasp.org/www-community/vulnerabilities/Responsible_Disclosure_Cheat_Sheet" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">OWASP Responsible Disclosure</a> - Guidelines for ethical disclosure</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
