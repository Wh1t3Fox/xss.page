/**
 * Learning Path Detail Page
 *
 * Displays all lessons in a specific learning path
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import LessonCard from '../../components/learn/LessonCard';
import ProgressBar from '../../components/learn/ProgressBar';
import { LessonCardSkeleton } from '../../components/learn/Skeleton';
import { learningPaths, lessons } from '../../data/learning-paths';
import { ProgressManager } from '../../utils/progress-manager';

export default function PathDetail() {
  const router = useRouter();
  const { pathId } = router.query;
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (pathId) {
      const loadedProgress = ProgressManager.load();
      setProgress(loadedProgress);

      // Mark path as started
      ProgressManager.startPath(pathId);
    }
  }, [pathId]);

  if (!pathId || !progress) {
    return (
      <Layout>
        <Head>
          <title>Loading Path - XSS.page</title>
        </Head>
        <div className="bg-gray-50 border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-100 rounded w-96 animate-pulse"></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <LessonCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const path = learningPaths[pathId];

  if (!path) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Path Not Found</h1>
          <p className="text-gray-600 mb-6">The learning path you're looking for doesn't exist.</p>
          <Link href="/learn" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to Learning Paths
          </Link>
        </div>
      </Layout>
    );
  }

  // Get lessons for this path
  const pathLessons = path.lessons
    .map(lessonId => lessons[lessonId])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  // Calculate progress
  const pathProgress = ProgressManager.getPathProgress(pathId, path);
  const completedLessons = pathLessons.filter(lesson =>
    progress.lessons[lesson.id]?.status === 'completed'
  ).length;

  // Badge colors
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700'
  };

  return (
    <Layout>
      <Head>
        <title>{path.title} - Learning Paths - XSS.page</title>
        <meta name="description" content={path.description} />
      </Head>

      {/* Header */}
      <div className={`bg-gradient-to-br from-${path.color}-600 to-${path.color}-800 text-white py-12`}
           style={{ backgroundColor: `var(--color-${path.color}-600)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/learn" className="text-white opacity-80 hover:opacity-100 transition inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              All Paths
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl font-bold">{path.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[path.difficulty]}`}>
                  {path.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-xl opacity-90 mb-4 max-w-3xl">
                {path.description}
              </p>
              <div className="flex items-center gap-6 text-sm opacity-80">
                <span>{path.estimatedHours} hours</span>
                <span>•</span>
                <span>{pathLessons.length} lessons</span>
                <span>•</span>
                <span>{completedLessons} completed</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {pathProgress > 0 && (
            <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Path Progress</span>
                <span>{Math.round(pathProgress)}%</span>
              </div>
              <div className="h-3 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${pathProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lessons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Prerequisites Warning */}
        {path.prerequisites && path.prerequisites.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <strong className="font-semibold">Prerequisites:</strong> This path requires completion of:{' '}
                  {path.prerequisites.map((prereqId, idx) => (
                    <span key={prereqId}>
                      {idx > 0 && ', '}
                      <Link href={`/learn/${prereqId}`} className="underline hover:text-yellow-900">
                        {learningPaths[prereqId]?.title || prereqId}
                      </Link>
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>

        <div className="space-y-4">
          {pathLessons.map((lesson, index) => {
            const lessonProgress = progress.lessons[lesson.id];
            const isLocked = false; // Can add lock logic based on prerequisites

            return (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                pathId={pathId}
                progress={lessonProgress}
                isLocked={isLocked}
              />
            );
          })}
        </div>

        {pathLessons.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No lessons available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
