/**
 * Learning Paths Hub Page
 *
 * Displays all available learning paths with progress tracking
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import PathCard from '../../components/learn/PathCard';
import StatsCard from '../../components/learn/StatsCard';
import { PathCardSkeleton } from '../../components/learn/Skeleton';
import { learningPaths } from '../../data/learning-paths';
import { ProgressManager } from '../../utils/progress-manager';

export default function LearnHub() {
  const [progress, setProgress] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadedProgress = ProgressManager.load();
    setProgress(loadedProgress);
  }, []);

  if (!progress) {
    return (
      <Layout>
        <Head>
          <title>Learning Paths - XSS.page</title>
        </Head>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <PathCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const paths = Object.values(learningPaths);

  // Filter paths by difficulty
  const filteredPaths = filter === 'all'
    ? paths
    : paths.filter(path => path.difficulty === filter);

  return (
    <Layout>
      <Head>
        <title>Learning Paths - XSS.page</title>
        <meta
          name="description"
          content="Master XSS security through structured lessons, hands-on challenges, and instant feedback. Choose from beginner to advanced learning paths."
        />
      </Head>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learning Paths
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Master XSS security through structured lessons, hands-on challenges, and instant feedback.
              Track your progress and earn points as you learn.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              label="Total Points"
              value={progress.stats.totalPoints || 0}
              icon="star"
              color="yellow"
            />
            <StatsCard
              label="Challenges Completed"
              value={progress.stats.challengesCompleted || 0}
              icon="check"
              color="green"
            />
            <StatsCard
              label="Lessons Completed"
              value={progress.stats.lessonsCompleted || 0}
              icon="book"
              color="blue"
            />
            <StatsCard
              label="Current Streak"
              value={`${progress.stats.streak || 0} ${progress.stats.streak === 1 ? 'day' : 'days'}`}
              icon="fire"
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Choose Your Path
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('beginner')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'beginner'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter('intermediate')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'intermediate'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter('advanced')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'advanced'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPaths.map(path => {
            const pathProgress = ProgressManager.getPathProgress(path.id, path);
            return (
              <PathCard
                key={path.id}
                path={path}
                progress={pathProgress}
              />
            );
          })}
        </div>

        {filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No paths found for this filter.</p>
          </div>
        )}

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-blue-900">How Learning Paths Work</h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Each path contains multiple lessons with theory, practice challenges, and quizzes</li>
                  <li>Complete challenges to earn points (hints and retries reduce points)</li>
                  <li>Score 70% or higher on quizzes to pass each lesson</li>
                  <li>Your progress is automatically saved in your browser</li>
                  <li>Build a daily streak by completing challenges every day</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
