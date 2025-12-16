/**
 * Lesson Page
 *
 * Displays a lesson with theory, practice challenges, and quiz
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import TabNavigation from '../../../components/TabNavigation';
import Challenge from '../../../components/learn/Challenge';
import Quiz from '../../../components/learn/Quiz';
import LessonNavigation from '../../../components/learn/LessonNavigation';
import CodeBlock from '../../../components/CodeBlock';
import { learningPaths, lessons, challenges as allChallenges } from '../../../data/learning-paths';
import { ProgressManager } from '../../../utils/progress-manager';

export default function LessonPage() {
  const router = useRouter();
  const { pathId, lessonId } = router.query;
  const [activeTab, setActiveTab] = useState('theory');
  const [progress, setProgress] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (lessonId) {
      const loadedProgress = ProgressManager.load();
      setProgress(loadedProgress);

      // Mark lesson as started
      ProgressManager.startLesson(lessonId);
    }
  }, [lessonId]);

  if (!pathId || !lessonId || !progress) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const path = learningPaths[pathId];
  const lesson = lessons[lessonId];

  if (!path || !lesson) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link href={`/learn/${pathId}`} className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Back to Path
          </Link>
        </div>
      </Layout>
    );
  }

  // Get challenges for this lesson
  const lessonChallenges = lesson.challenges
    .map(challengeId => allChallenges[challengeId])
    .filter(Boolean);

  // Get all lessons for navigation
  const allLessons = path.lessons
    .map(id => lessons[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  // Check lesson completion
  const lessonProgress = progress.lessons[lessonId];
  const isLessonComplete = ProgressManager.isLessonComplete(lessonId, lesson);

  // Handle challenge completion
  const handleChallengeComplete = (points) => {
    console.log(`Challenge completed! Earned ${points} points`);
    setRefreshKey(prev => prev + 1); // Force re-render
    const newProgress = ProgressManager.load();
    setProgress(newProgress);
  };

  // Handle quiz completion
  const handleQuizComplete = (results) => {
    console.log('Quiz completed:', results);
    setRefreshKey(prev => prev + 1);
    const newProgress = ProgressManager.load();
    setProgress(newProgress);

    if (results.passed && isLessonComplete) {
      // Show completion message
      alert('Lesson completed! Great job!');
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'theory', label: 'Theory' },
    { id: 'practice', label: `Practice (${lessonChallenges.length})` },
    { id: 'quiz', label: `Quiz (${lesson.quiz?.length || 0})` }
  ];

  return (
    <Layout>
      <Head>
        <title>{lesson.title} - {path.title} - XSS.page</title>
        <meta name="description" content={lesson.description} />
      </Head>

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4 flex items-center text-sm">
            <Link href="/learn" className="text-gray-600 hover:text-gray-900">
              Learning Paths
            </Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href={`/learn/${pathId}`} className="text-gray-600 hover:text-gray-900">
              {path.title}
            </Link>
            <svg className="w-4 h-4 mx-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 font-medium">{lesson.title}</span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{lesson.estimatedMinutes} min</span>
                <span>•</span>
                <span>{lessonChallenges.length} challenges</span>
                {lesson.quiz && (
                  <>
                    <span>•</span>
                    <span>{lesson.quiz.length} quiz questions</span>
                  </>
                )}
              </div>
            </div>

            {isLessonComplete && (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full font-semibold">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Completed
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          {lesson.objectives && lesson.objectives.length > 0 && (
            <div className="mt-6 bg-white rounded-lg p-5 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {lesson.objectives.map((objective, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-primary-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="mt-8">
          {/* Theory Tab */}
          {activeTab === 'theory' && lesson.content && (
            <div className="space-y-8">
              {/* Markdown Content */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 prose max-w-none">
                <div dangerouslySetInnerHTML={{
                  __html: lesson.content.theory.split('\n').map(line => {
                    // Simple markdown parsing (you might want to use a proper markdown library)
                    if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
                    if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
                    if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
                    if (line.startsWith('- ')) return `<li>${line.substring(2)}</li>`;
                    if (line.startsWith('> ')) return `<blockquote>${line.substring(2)}</blockquote>`;
                    if (line.startsWith('**') && line.endsWith('**')) return `<strong>${line.substring(2, line.length - 2)}</strong>`;
                    if (line.trim() === '') return '<br>';
                    if (line.startsWith('```')) return line.includes('```') ? '<pre><code>' : '</code></pre>';
                    return `<p>${line}</p>`;
                  }).join('\n')
                }} />
              </div>

              {/* Code Examples */}
              {lesson.content.examples && lesson.content.examples.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Examples</h3>
                  <div className="space-y-6">
                    {lesson.content.examples.map((example, idx) => (
                      <div key={idx} className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
                        example.vulnerable ? 'border-red-200' : 'border-green-200'
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{example.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            example.vulnerable
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {example.vulnerable ? 'VULNERABLE' : 'SAFE'}
                          </span>
                        </div>
                        <CodeBlock code={example.code} language="html" />
                        <p className="text-sm text-gray-700 mt-4">{example.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              {lessonChallenges.map(challenge => (
                <Challenge
                  key={challenge.id}
                  challenge={challenge}
                  onComplete={handleChallengeComplete}
                />
              ))}

              {lessonChallenges.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No challenges available for this lesson.</p>
                </div>
              )}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && lesson.quiz && (
            <Quiz
              questions={lesson.quiz}
              lessonId={lessonId}
              onComplete={handleQuizComplete}
            />
          )}
        </div>

        {/* Lesson Navigation */}
        <LessonNavigation
          pathId={pathId}
          currentLessonId={lessonId}
          allLessons={allLessons}
        />
      </div>
    </Layout>
  );
}
