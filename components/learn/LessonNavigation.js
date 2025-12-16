/**
 * Lesson Navigation Component
 *
 * Previous/Next buttons for navigating between lessons
 */

import Link from 'next/link';

export default function LessonNavigation({ pathId, currentLessonId, allLessons }) {
  // Find current lesson index
  const currentIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId);

  // Get previous and next lessons
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (!prevLesson && !nextLesson) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-8">
      {/* Previous Lesson */}
      <div className="flex-1">
        {prevLesson ? (
          <Link href={`/learn/${pathId}/${prevLesson.id}`}>
            <div className="group cursor-pointer inline-flex items-center text-primary-600 hover:text-primary-700 transition">
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Previous</div>
                <div className="font-semibold">{prevLesson.title}</div>
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Next Lesson */}
      <div className="flex-1 text-right">
        {nextLesson ? (
          <Link href={`/learn/${pathId}/${nextLesson.id}`}>
            <div className="group cursor-pointer inline-flex items-center text-primary-600 hover:text-primary-700 transition">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Next</div>
                <div className="font-semibold">{nextLesson.title}</div>
              </div>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ) : (
          <Link href={`/learn/${pathId}`}>
            <div className="group cursor-pointer inline-flex items-center text-primary-600 hover:text-primary-700 transition">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Finish</div>
                <div className="font-semibold">Back to Path</div>
              </div>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
