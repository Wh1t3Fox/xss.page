import Link from 'next/link'

export default function Layout({ children, title = 'XSS.page - XSS Documentation & Resources' }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              XSS.page
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Home
              </Link>
              <Link href="/playground" className="text-gray-700 hover:text-primary-600">
                Playground
              </Link>
              <Link href="/payloads" className="text-gray-700 hover:text-primary-600">
                Payloads
              </Link>
              <Link href="/learn" className="text-gray-700 hover:text-primary-600">
                Learn
              </Link>
              <Link href="/tools" className="text-gray-700 hover:text-primary-600">
                Tools
              </Link>
              <a
                href="https://github.com/Wh1t3Fox/xss.page"
                className="text-gray-700 hover:text-primary-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            Educational resource for understanding Cross-Site Scripting vulnerabilities
          </p>
        </div>
      </footer>
    </div>
  )
}
