import Link from 'next/link';

export default function ToolCard({ title, description, icon, href, status, tags }) {
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    beta: 'bg-blue-100 text-blue-800',
    coming: 'bg-gray-100 text-gray-800'
  };

  return (
    <Link
      href={href}
      className={`block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all ${
        status === 'coming' ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {status && (
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>
                {status === 'coming' ? 'Coming Soon' : status === 'beta' ? 'Beta' : 'Available'}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-3">{description}</p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Arrow */}
        {status !== 'coming' && (
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}
