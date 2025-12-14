export default function XSSTypeCard({ type, description, example, severity }) {
  const severityColors = {
    high: 'bg-orange-100 text-orange-700 border-orange-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    critical: 'bg-red-100 text-red-700 border-red-300'
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{type}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[severity]}`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {example && (
        <div className="bg-gray-50 rounded border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">EXAMPLE:</p>
          <code className="text-sm text-gray-800 font-mono block overflow-x-auto">
            {example}
          </code>
        </div>
      )}
    </div>
  )
}
