/**
 * Lesson Card Component
 *
 * Displays a lesson in a learning path with completion status
 */

import Link from 'next/link';

export default function LessonCard({ lesson, pathId, progress, isLocked = false }) {
  const isCompleted = progress?.status === 'completed';
  const isInProgress = progress?.status === 'in-progress';
  const notStarted = !progress || progress.status === 'not-started';

  return (
    <Link href={isLocked ? '#' : `/learn/${pathId}/${lesson.id}`}>
      <div className={`bg-white rounded-lg shadow-sm border-2 p-5 transition-all ${
        isLocked
          ? 'border-gray-200 opacity-60 cursor-not-allowed'
          : 'border-gray-200 hover:border-primary-400 hover:shadow-md cursor-pointer'
      }`}>
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              {/* Status Icon */}
              <div className="mr-3">
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : isInProgress ? (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : isLocked ? (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {lesson.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {lesson.estimatedMinutes} min • {lesson.challenges?.length || 0} challenges
                </p>
              </div>
            </div>

            <p className="text-gray-700 mt-2 text-sm line-clamp-2">
              {lesson.description}
            </p>

            {/* Objectives */}
            {lesson.objectives && lesson.objectives.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">Learning Objectives:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {lesson.objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                  {lesson.objectives.length > 2 && (
                    <li className="text-gray-500 ml-4">
                      +{lesson.objectives.length - 2} more...
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Status Badge & Arrow */}
          <div className="ml-4 flex flex-col items-end">
            {isCompleted && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 mb-2">
                DONE
              </span>
            )}
            {isInProgress && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-2">
                IN PROGRESS
              </span>
            )}
            {isLocked && (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 mb-2">
                LOCKED
              </span>
            )}

            {!isLocked && (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        </div>

        {/* Progress Info */}
        {progress && (progress.challengesCompleted || progress.quizScore !== null) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-sm">
            {progress.challengesCompleted && progress.challengesCompleted.length > 0 && (
              <span className="text-gray-600">
                <span className="font-semibold text-primary-600">
                  {progress.challengesCompleted.length}
                </span> challenges completed
              </span>
            )}
            {progress.quizScore !== null && (
              <span className="text-gray-600">
                Quiz: <span className={`font-semibold ${progress.quizScore >= 70 ? 'text-green-600' : 'text-yellow-600'}`}>
                  {progress.quizScore}%
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
