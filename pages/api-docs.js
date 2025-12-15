import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import CodeBlock from '../components/CodeBlock';

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('payloads');

  const endpoints = [
    {
      id: 'payloads',
      name: 'All Payloads',
      path: '/api/payloads.json',
      description: 'Retrieve all XSS payloads with complete metadata including severity, context, and browser compatibility.',
      response: {
        version: "1.0",
        count: 150,
        generated: "2024-12-14T00:00:00Z",
        payloads: "[...payload objects]"
      }
    },
    {
      id: 'categories',
      name: 'Categories',
      path: '/api/categories.json',
      description: 'Get a list of all payload categories with counts and descriptions.',
      response: {
        version: "1.0",
        total: 27,
        categories: "[...category objects with id, name, count, description]"
      }
    },
    {
      id: 'by-category',
      name: 'Payloads by Category',
      path: '/api/payloads-by-category.json',
      description: 'Payloads organized by category for easier filtering and navigation.',
      response: {
        version: "1.0",
        categoryCount: 27,
        categories: {
          basic: "[...payload objects]",
          "event-handler": "[...payload objects]"
        }
      }
    },
    {
      id: 'schema',
      name: 'Payload Schema',
      path: '/api/schema.json',
      description: 'JSON schema definition for payload objects, useful for validation and documentation.',
      response: {
        version: "1.0",
        schema: {
          type: "object",
          properties: "{ ... }"
        },
        example: "{ ...payload object }"
      }
    }
  ];

  const integrationExamples = {
    curl: `# Fetch all payloads
curl https://xss.page/api/payloads.json

# Fetch categories
curl https://xss.page/api/categories.json

# Fetch payloads organized by category
curl https://xss.page/api/payloads-by-category.json`,

    javascript: `// Fetch all payloads
fetch('https://xss.page/api/payloads.json')
  .then(response => response.json())
  .then(data => {
    console.log(\`Loaded \${data.count} payloads\`);
    data.payloads.forEach(payload => {
      console.log(\`[\${payload.severity}] \${payload.payload}\`);
    });
  });

// Fetch specific category
fetch('https://xss.page/api/payloads-by-category.json')
  .then(response => response.json())
  .then(data => {
    const basicPayloads = data.categories.basic;
    console.log(\`Found \${basicPayloads.length} basic payloads\`);
  });`,

    python: `import requests
import json

# Fetch all payloads
response = requests.get('https://xss.page/api/payloads.json')
data = response.json()

print(f"Loaded {data['count']} payloads")

# Filter by severity
critical_payloads = [
    p for p in data['payloads']
    if p['severity'] == 'critical'
]

print(f"Found {len(critical_payloads)} critical payloads")

# Filter by context
html_payloads = [
    p for p in data['payloads']
    if p['context'] == 'html'
]

for payload in html_payloads[:5]:
    print(f"[{payload['category']}] {payload['payload']}")`,

    burp: `// Burp Suite Extension Example (Java)
import burp.*;
import java.net.*;
import java.io.*;
import org.json.*;

public class XSSPayloadLoader implements IBurpExtender {
    private IExtensionHelpers helpers;

    public void registerExtenderCallbacks(IBurpExtenderCallbacks callbacks) {
        helpers = callbacks.getHelpers();
        callbacks.setExtensionName("XSS Payload Loader");

        try {
            // Load payloads from API
            URL url = new URL("https://xss.page/api/payloads.json");
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(url.openStream())
            );

            StringBuilder json = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                json.append(line);
            }
            reader.close();

            // Parse JSON
            JSONObject data = new JSONObject(json.toString());
            JSONArray payloads = data.getJSONArray("payloads");

            // Use payloads in your scanner
            callbacks.printOutput("Loaded " + payloads.length() + " XSS payloads");

            for (int i = 0; i < payloads.length(); i++) {
                JSONObject payload = payloads.getJSONObject(i);
                String xss = payload.getString("payload");
                String severity = payload.getString("severity");

                // Add to intruder payloads or scanner
                callbacks.printOutput("[" + severity + "] " + xss);
            }

        } catch (Exception e) {
            callbacks.printError("Error loading payloads: " + e.getMessage());
        }
    }
}`,

    zap: `# OWASP ZAP Python Script
import requests
import json
from zaproxy.core import ScriptVars

# Fetch payloads from API
response = requests.get('https://xss.page/api/payloads.json')
data = response.json()

payloads = data['payloads']
print(f"Loaded {len(payloads)} XSS payloads from xss.page")

# Filter by severity for targeted testing
critical_payloads = [p for p in payloads if p['severity'] == 'critical']

# Use in ZAP fuzzer
for payload_obj in critical_payloads:
    payload = payload_obj['payload']
    category = payload_obj['category']

    # Add to custom fuzzer
    ScriptVars.setGlobalVar(f"xss_payload_{category}", payload)
    print(f"Added [{category}] {payload}")

# Example: Test a parameter with all payloads
def test_parameter(url, param_name):
    for payload_obj in payloads:
        test_url = f"{url}?{param_name}={payload_obj['payload']}"
        # Send request through ZAP
        # ... your testing logic here
        pass`
  };

  return (
    <Layout>
      <Head>
        <title>API Documentation - XSS.page</title>
        <meta
          name="description"
          content="Static JSON API for programmatic access to XSS payloads. Integrate with Burp Suite, OWASP ZAP, and custom security tools."
        />
      </Head>

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            API Documentation
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Static JSON API for programmatic access to our XSS payload database.
            Perfect for integration with Burp Suite, OWASP ZAP, and custom security tools.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key Features */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Static JSON API - Simple & Fast
              </h3>
              <p className="text-blue-800 mb-2">
                All endpoints are static JSON files served from our CDN. No authentication required,
                no rate limits, and no CORS issues. Perfect for automated security testing and integration.
              </p>
              <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                <li>150+ XSS payloads across 27 categories</li>
                <li>No API keys or authentication needed</li>
                <li>CORS-enabled for browser-based tools</li>
                <li>Fast CDN delivery with aggressive caching</li>
                <li>Free for educational and authorized testing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">API Endpoints</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {endpoints.map(endpoint => (
              <button
                key={endpoint.id}
                onClick={() => setSelectedEndpoint(endpoint.id)}
                className={`text-left p-4 rounded-lg border-2 transition ${
                  selectedEndpoint === endpoint.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">{endpoint.name}</div>
                <code className="text-sm text-primary-600 break-all">{endpoint.path}</code>
                <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Endpoint Details */}
          {endpoints.filter(e => e.id === selectedEndpoint).map(endpoint => (
            <div key={endpoint.id} className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{endpoint.name}</h3>
                <a
                  href={endpoint.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition"
                >
                  Open Endpoint →
                </a>
              </div>

              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-700">Endpoint URL:</span>
                <code className="block bg-gray-100 px-4 py-2 rounded mt-2 text-sm">
                  https://xss.page{endpoint.path}
                </code>
              </div>

              <div>
                <span className="text-sm font-semibold text-gray-700 mb-2 block">Response Format:</span>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
{JSON.stringify(endpoint.response, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Integration Examples */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Examples</h2>

          <div className="space-y-6">
            {/* cURL */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center mr-2 text-sm">$</span>
                cURL (Command Line)
              </h3>
              <CodeBlock code={integrationExamples.curl} language="bash" />
            </div>

            {/* JavaScript/Node.js */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center mr-2 text-sm">JS</span>
                JavaScript / Node.js
              </h3>
              <CodeBlock code={integrationExamples.javascript} language="javascript" />
            </div>

            {/* Python */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center mr-2 text-sm">🐍</span>
                Python
              </h3>
              <CodeBlock code={integrationExamples.python} language="python" />
            </div>

            {/* Burp Suite */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center mr-2 text-sm">☕</span>
                Burp Suite Extension (Java)
              </h3>
              <CodeBlock code={integrationExamples.burp} language="java" />
            </div>

            {/* OWASP ZAP */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center mr-2 text-sm">⚡</span>
                OWASP ZAP Script (Python)
              </h3>
              <CodeBlock code={integrationExamples.zap} language="python" />
            </div>
          </div>
        </div>

        {/* Usage Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Benefits
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>No authentication or API keys required</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>No rate limiting or usage restrictions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>CORS-enabled for browser usage</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Cached for fast global access</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Versioned for stability</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Cache responses locally to reduce requests</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Check the version field for updates</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Filter by severity for targeted testing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use context field to match injection points</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Only test on authorized systems</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                Authorized Testing Only
              </h3>
              <p className="text-yellow-800 text-sm">
                This API is provided for educational purposes and authorized security testing only.
                Only use these payloads on systems you own or have explicit written permission to test.
                Unauthorized access to computer systems is illegal and unethical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
