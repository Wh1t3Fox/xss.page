import Head from 'next/head';
import Layout from '../../components/Layout';
import PayloadFuzzer from '../../components/tools/PayloadFuzzer';

export default function PayloadFuzzerPage() {
  return (
    <Layout>
      <Head>
        <title>Payload Fuzzer - XSS.page</title>
        <meta
          name="description"
          content="Generate XSS payload variations using mutation strategies. Test against custom filters and create encoding chains for bypass attempts."
        />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Payload Fuzzer
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Generate payload variations using mutation strategies. Test against custom filters
            and create encoding chains to identify potential WAF bypasses.
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
                {' '}These mutation techniques are designed for educational purposes and authorized security testing.
                Only use on systems you own or have explicit permission to test.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tool Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PayloadFuzzer />
      </div>

      {/* Educational Section - Mutation Strategies */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Mutation Strategies Explained
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Encoding Mutations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  1
                </span>
                Encoding Mutations
              </h3>
              <p className="text-gray-600 mb-3">
                Transform payloads using various encoding schemes to bypass filters that check for
                specific string patterns.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>HTML Entities:</strong> Convert to decimal or hex entities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>URL Encoding:</strong> Single or double percent-encoding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Unicode Escapes:</strong> \uXXXX or \xXX format</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span><strong>Base64:</strong> Encode with data URI wrapper</span>
                </li>
              </ul>
            </div>

            {/* Case Variations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  2
                </span>
                Case Variations
              </h3>
              <p className="text-gray-600 mb-3">
                Modify character casing to bypass case-sensitive filters and WAF rules.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Uppercase:</strong> ALL CAPS transformation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Lowercase:</strong> all lowercase transformation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Mixed Case:</strong> Capitalize first letters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span><strong>Alternating:</strong> aLtErNaTiNg case pattern</span>
                </li>
              </ul>
            </div>

            {/* Character Substitution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  3
                </span>
                Character Substitution
              </h3>
              <p className="text-gray-600 mb-3">
                Replace specific characters with functional alternatives to evade detection.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Quote Variations:</strong> Switch between ", ', and `</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Whitespace:</strong> Use tabs, newlines, or form feeds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span><strong>Null Bytes:</strong> Insert \x00 to truncate strings</span>
                </li>
              </ul>
            </div>

            {/* Structure Mutations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-orange-100 text-orange-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  4
                </span>
                Structure Mutations
              </h3>
              <p className="text-gray-600 mb-3">
                Modify HTML/JavaScript structure while maintaining functionality.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span><strong>Comments:</strong> Insert HTML or JS comments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span><strong>Self-Closing Tags:</strong> Add/remove {'/>'} syntax</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">•</span>
                  <span><strong>Protocols:</strong> Vary javascript:, data:, vbscript:</span>
                </li>
              </ul>
            </div>

            {/* Obfuscation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-red-100 text-red-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  5
                </span>
                Obfuscation Techniques
              </h3>
              <p className="text-gray-600 mb-3">
                Advanced techniques to hide payload intent from pattern-based detection.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>String Concatenation:</strong> 'al'+'ert' patterns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Template Literals:</strong> Use backticks for execution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span><strong>Hex Strings:</strong> \x escape sequences</span>
                </li>
              </ul>
            </div>

            {/* Filter Testing */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">
                  6
                </span>
                Filter Testing
              </h3>
              <p className="text-gray-600 mb-3">
                Automatically test generated mutations against custom WAF rules or blacklists.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>Regex Patterns:</strong> Test against regex-based filters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>String Matching:</strong> Check for blacklisted strings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span><strong>Bypass Identification:</strong> Highlight successful bypasses</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Common Use Cases
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WAF Bypass Testing</h3>
            <p className="text-gray-600">
              Generate variations to test Web Application Firewall effectiveness and identify
              potential bypass techniques for responsible disclosure.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payload Library Building</h3>
            <p className="text-gray-600">
              Create comprehensive payload collections for security tools like Burp Suite intruder
              or OWASP ZAP fuzzer modules.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-primary-600 mb-4">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Security Training</h3>
            <p className="text-gray-600">
              Educate developers and security teams about encoding techniques and mutation
              strategies used in real-world attacks.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
