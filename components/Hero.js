import Link from 'next/link'

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-5xl font-extrabold mb-6">
          Cross-Site Scripting (XSS)
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mb-8">
          A comprehensive guide to understanding, identifying, and preventing
          Cross-Site Scripting vulnerabilities in web applications.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/playground"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try Interactive Playground
          </Link>
          <a
            href="#types"
            className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border border-primary-500"
          >
            Learn About XSS Types
          </a>
          <a
            href="#resources"
            className="bg-primary-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-900 transition border border-primary-600"
          >
            View Resources
          </a>
        </div>
      </div>
    </div>
  )
}
