/**
 * Path Card Component
 *
 * Displays a learning path with progress indicator
 */

import Link from 'next/link';
import ProgressBar from './ProgressBar';

export default function PathCard({ path, progress = 0 }) {
  // Badge colors by difficulty
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  // Card border colors
  const borderColors = {
    green: 'border-green-200 hover:border-green-400',
    blue: 'border-blue-200 hover:border-blue-400',
    red: 'border-red-200 hover:border-red-400',
    purple: 'border-purple-200 hover:border-purple-400',
    cyan: 'border-cyan-200 hover:border-cyan-400',
    emerald: 'border-emerald-200 hover:border-emerald-400',
    yellow: 'border-yellow-200 hover:border-yellow-400'
  };

  const isStarted = progress > 0;
  const isCompleted = progress >= 100;

  return (
    <Link href={`/learn/${path.id}`}>
      <div className={`bg-white rounded-lg shadow-md border-2 ${borderColors[path.color] || borderColors.green} p-6 cursor-pointer transition-all hover:shadow-lg group`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
              {path.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {path.estimatedHours} hours • {path.lessons?.length || 0} lessons
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[path.difficulty] || difficultyColors.beginner}`}>
            {path.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2">
          {path.description}
        </p>

        {/* Prerequisites */}
        {path.prerequisites && path.prerequisites.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500">
              Prerequisites: {path.prerequisites.join(', ')}
            </p>
          </div>
        )}

        {/* Progress */}
        {isStarted && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              {isCompleted && (
                <span className="text-xs font-semibold text-green-600 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  COMPLETED
                </span>
              )}
            </div>
            <ProgressBar
              progress={progress}
              showPercentage={false}
              size="sm"
              color={path.color || 'primary'}
            />
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <span className={`text-sm font-semibold ${isCompleted ? 'text-green-600' : isStarted ? 'text-primary-600' : 'text-gray-600'}`}>
            {isCompleted ? 'Review Path' : isStarted ? 'Continue Learning' : 'Start Learning'}
          </span>
          <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
