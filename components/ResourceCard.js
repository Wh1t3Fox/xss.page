export default function ResourceCard({ title, description, url, type }) {
  const typeStyles = {
    tool: 'bg-blue-50 text-blue-700',
    documentation: 'bg-green-50 text-green-700',
    guide: 'bg-purple-50 text-purple-700',
    cheatsheet: 'bg-orange-50 text-orange-700'
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-primary-300 transition"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${typeStyles[type]}`}>
          {type}
        </span>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
      <div className="mt-4 flex items-center text-primary-600 text-sm font-semibold">
        Visit Resource
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </a>
  )
}
