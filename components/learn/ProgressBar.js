/**
 * Progress Bar Component
 *
 * Visual progress indicator showing completion percentage
 */

export default function ProgressBar({ progress, showPercentage = true, size = 'md', color = 'primary' }) {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress || 0));

  // Size classes
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  // Color classes for the fill
  const colorClasses = {
    primary: 'bg-primary-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="w-full">
      <div className={`w-full ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-right text-sm text-gray-600 mt-1">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
