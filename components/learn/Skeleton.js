/**
 * Skeleton Loading Components
 *
 * Placeholder components shown while content is loading
 */

export function PathCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-0 mb-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-100 rounded w-20 self-start sm:self-auto"></div>
      </div>
      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-5/6 mb-4"></div>
      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="h-3 bg-gray-100 rounded w-16"></div>
        <div className="h-3 bg-gray-100 rounded w-16"></div>
        <div className="h-3 bg-gray-100 rounded w-24"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-full"></div>
    </div>
  );
}

export function LessonCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-100 rounded w-4/5"></div>
          </div>
        </div>
        <div className="ml-0 sm:ml-4 mt-3 sm:mt-0">
          <div className="h-4 bg-gray-100 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

export function ChallengeCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-100 rounded w-20"></div>
      </div>
      <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-6"></div>
      <div className="h-32 bg-gray-100 rounded mb-4"></div>
      <div className="h-12 bg-gray-200 rounded"></div>
    </div>
  );
}

export function QuizCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}
