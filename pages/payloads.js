import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';
import { payloads, categories, getPayloadsByCategory, searchPayloads } from '../data/payloads';

export default function Payloads() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPayloads = searchQuery
    ? searchPayloads(searchQuery)
    : getPayloadsByCategory(selectedCategory);

  return (
    <Layout>
      <Head>
        <title>XSS Payload Cheat Sheet - XSS.page</title>
        <meta name="description" content="Comprehensive XSS payload cheat sheet with 150 examples for educational and authorized testing purposes" />
      </Head>

      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            XSS Payload Cheat Sheet
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Comprehensive collection of 150 XSS payloads organized by technique and context
          </p>

          {/* Warning */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong className="font-semibold">For educational and authorized testing purposes only.</strong>
                  {' '}Unauthorized access to computer systems is illegal. Use these payloads only on systems you own or have explicit permission to test.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Download */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payloads..."
            className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <a
            href="/xss-payloads.txt"
            download="xss-payloads.txt"
            className="bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition inline-flex items-center justify-center whitespace-nowrap"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download TXT
          </a>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredPayloads.length} payload{filteredPayloads.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Payloads Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPayloads.map((payload) => (
            <div
              key={payload.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                      {payload.category}
                    </span>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      payload.severity === 'critical' ? 'bg-red-600 text-white' :
                      payload.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      payload.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {payload.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{payload.description}</p>
                </div>
              </div>

              {/* Payload */}
              <div className="mb-4">
                <CodeBlock code={payload.payload} language="html" showCopy={true} />
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-semibold">Technique:</span> {payload.technique}
                </div>
                <div>
                  <span className="font-semibold">Context:</span> {payload.context}
                </div>
                {payload.browsers && (
                  <div>
                    <span className="font-semibold">Browsers:</span> {payload.browsers.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredPayloads.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No payloads found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
