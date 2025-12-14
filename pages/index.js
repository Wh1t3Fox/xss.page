import Layout from '../components/Layout'
import Hero from '../components/Hero'
import XSSTypeCard from '../components/XSSTypeCard'
import ResourceCard from '../components/ResourceCard'
import SEO from '../components/SEO'

export default function HomePage() {
  const xssTypes = [
    {
      type: 'Reflected XSS',
      description: 'Malicious script is reflected off a web server, typically via a URL parameter, form input, or search field. The attack is not persistent and requires the victim to trigger it.',
      example: 'https://example.com/search?q=<script>alert(document.cookie)</script>',
      severity: 'high'
    },
    {
      type: 'Stored XSS',
      description: 'Malicious script is permanently stored on the target server (database, message forum, comment field). The script is executed whenever a user accesses the affected page.',
      example: 'Comment: <img src=x onerror="alert(\'XSS\')">',
      severity: 'critical'
    },
    {
      type: 'DOM-based XSS',
      description: 'The vulnerability exists in client-side code rather than server-side. The attack payload is executed by modifying the DOM environment in the victim\'s browser.',
      example: 'document.write(location.hash.substring(1))',
      severity: 'high'
    },
    {
      type: 'Mutation-based XSS (mXSS)',
      description: 'Exploits the way browsers parse and render HTML. The payload mutates during sanitization or rendering, bypassing filters.',
      example: '<noscript><p title="</noscript><img src=x onerror=alert(1)>">',
      severity: 'high'
    },
    {
      type: 'Self-XSS',
      description: 'Requires the victim to input malicious content themselves, often through social engineering. Less severe as it requires user interaction.',
      example: 'Tricking users to paste malicious code into browser console',
      severity: 'medium'
    },
    {
      type: 'Blind XSS',
      description: 'Stored XSS where the attacker cannot see the result directly. Often targets admin panels or internal systems that process user input.',
      example: 'Payload in support ticket that executes when admin views it',
      severity: 'critical'
    }
  ]

  const resources = [
    {
      title: 'OWASP XSS Guide',
      description: 'Comprehensive guide from OWASP on Cross-Site Scripting prevention and testing',
      url: 'https://owasp.org/www-community/attacks/xss/',
      type: 'documentation'
    },
    {
      title: 'PortSwigger XSS Cheat Sheet',
      description: 'Extensive collection of XSS vectors and filter bypass techniques',
      url: 'https://portswigger.net/web-security/cross-site-scripting/cheat-sheet',
      type: 'cheatsheet'
    },
    {
      title: 'Content Security Policy (CSP)',
      description: 'MDN documentation on implementing CSP to prevent XSS attacks',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP',
      type: 'documentation'
    },
    {
      title: 'XSS Hunter',
      description: 'Platform for finding blind XSS vulnerabilities',
      url: 'https://xsshunter.com/',
      type: 'tool'
    },
    {
      title: 'DOMPurify',
      description: 'Fast, tolerant XSS sanitizer for HTML, MathML and SVG',
      url: 'https://github.com/cure53/DOMPurify',
      type: 'tool'
    },
    {
      title: 'HackerOne XSS Reports',
      description: 'Real-world XSS vulnerability reports and write-ups',
      url: 'https://hackerone.com/hacktivity?querystring=XSS',
      type: 'guide'
    }
  ]

  return (
    <>
      <SEO />
      <Layout>
        <Hero />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What is Cross-Site Scripting?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Cross-Site Scripting (XSS) is a security vulnerability that allows attackers
                to inject malicious scripts into web pages viewed by other users. These scripts
                can steal sensitive information, hijack user sessions, deface websites, or
                redirect users to malicious sites.
              </p>
              <p className="mt-4">
                XSS attacks occur when a web application includes untrusted data in a page
                without proper validation or escaping. The three main types are <strong>Reflected XSS</strong>,
                <strong> Stored XSS</strong>, and <strong>DOM-based XSS</strong>, each with unique
                characteristics and exploitation methods.
              </p>
            </div>
          </div>
        </section>

        <section id="types" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Types of XSS Vulnerabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {xssTypes.map((xss, index) => (
                <XSSTypeCard key={index} {...xss} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Prevention Strategies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Input Validation</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Validate all user input against expected formats
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use allowlists instead of denylists
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Sanitize input on server-side
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Output Encoding</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  HTML encode output data
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use context-appropriate encoding
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Escape JavaScript strings properly
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Content Security Policy</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Implement strict CSP headers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Disable inline JavaScript execution
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use nonce or hash-based CSP
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Security Headers</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Set X-XSS-Protection header
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Use X-Content-Type-Options
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Enable HTTPOnly and Secure flags on cookies
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="resources" className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
              Resources & Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <ResourceCard key={index} {...resource} />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
