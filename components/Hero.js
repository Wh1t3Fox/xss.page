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
        <div className="flex space-x-4">
          <a
            href="#types"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Learn About XSS Types
          </a>
          <a
            href="#resources"
            className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition border border-primary-500"
          >
            View Resources
          </a>
        </div>
      </div>
    </div>
  )
}
