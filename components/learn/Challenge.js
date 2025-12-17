/**
 * Challenge Component
 *
 * Interactive XSS challenge with validation and feedback
 */

import { useState, useEffect } from 'react';
import { validateChallenge, calculatePoints } from '../../utils/challenge-validator';
import { ProgressManager } from '../../utils/progress-manager';
import CodeBlock from '../CodeBlock';

export default function Challenge({ challenge, onComplete }) {
  const [payload, setPayload] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [result, setResult] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load challenge progress
  useEffect(() => {
    const progress = ProgressManager.getChallengeProgress(challenge.id);
    if (progress?.completed) {
      setIsCompleted(true);
      setPayload(progress.solution || '');
      setShowSolution(true);
    }
  }, [challenge.id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);

    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const validation = validateChallenge(challenge, payload);
    setResult(validation);
    setIsSubmitting(false);

    if (validation.success) {
      const finalPoints = calculatePoints(challenge.points, attempts + 1, hintsUsed);

      // Save progress
      ProgressManager.completeChallenge(
        challenge.id,
        finalPoints,
        payload,
        attempts + 1,
        hintsUsed
      );

      // Add to lesson's completed challenges
      ProgressManager.addChallengeToLesson(challenge.lessonId, challenge.id);

      setIsCompleted(true);
      setShowSolution(true);

      // Notify parent component
      if (onComplete) {
        onComplete(finalPoints);
      }
    }
  };

  const handleHint = () => {
    setHintsUsed(prev => prev + 1);
    // Hints are shown in the scenario already
    alert(challenge.scenario.hint || 'Review the challenge description carefully');
  };

  const handleRevealSolution = () => {
    if (isCompleted) {
      setShowSolution(true);
    }
  };

  // Difficulty badge colors
  const difficultyColors = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700'
  };

  const currentPoints = calculatePoints(challenge.points, attempts + 1, hintsUsed);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
      {/* Challenge Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {challenge.title}
          </h3>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[challenge.difficulty] || difficultyColors.easy}`}>
              {challenge.difficulty.toUpperCase()}
            </span>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                COMPLETED
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-3">{challenge.description}</p>

        <div className="flex items-center gap-6 text-sm text-gray-600">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Base Points: {challenge.points}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Attempts: {attempts}
          </span>
          {hintsUsed > 0 && (
            <span className="flex items-center text-yellow-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Hints Used: {hintsUsed}
            </span>
          )}
          {!isCompleted && attempts > 0 && (
            <span className="font-semibold text-primary-600">
              Current: {currentPoints} pts
            </span>
          )}
        </div>
      </div>

      {/* Scenario */}
      <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Scenario
        </h4>
        <p className="text-gray-700 mb-4">{challenge.scenario.description}</p>

        {challenge.scenario.vulnerableCode && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-600 mb-2">Vulnerable Code:</div>
            <CodeBlock code={challenge.scenario.vulnerableCode.trim()} language="javascript" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded p-3 border border-gray-200">
            <span className="font-semibold text-gray-700">Context:</span>
            <span className="ml-2 text-gray-600">{challenge.scenario.context}</span>
          </div>
          <div className="bg-white rounded p-3 border border-gray-200">
            <span className="font-semibold text-gray-700">Filter:</span>
            <span className="ml-2 text-gray-600">{challenge.scenario.filterType}</span>
          </div>
        </div>
      </div>

      {/* Payload Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Payload
        </label>
        <textarea
          value={payload}
          onChange={(e) => setPayload(e.target.value)}
          placeholder="Enter your XSS payload here..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-mono text-sm resize-none"
          rows={5}
          disabled={isCompleted}
        />
        <p className="text-xs text-gray-500 mt-1">
          {payload.length} characters
        </p>
      </div>

      {/* Actions */}
      {!isCompleted && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleSubmit}
            disabled={!payload.trim() || isSubmitting}
            className="flex-1 bg-primary-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold flex items-center justify-center min-h-[44px]"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Solution
              </>
            )}
          </button>
          <button
            onClick={handleHint}
            className="px-4 sm:px-6 py-3 bg-yellow-50 text-yellow-700 border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition font-semibold flex items-center min-h-[44px]"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Hint (-5 pts)
          </button>
        </div>
      )}

      {/* Result Feedback */}
      {result && (
        <div className={`border-l-4 rounded-lg p-5 mb-6 animate-slideInDown ${
          result.success
            ? 'bg-green-50 border-green-400'
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.success ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3 flex-1">
              <h4 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.success ? 'Challenge Completed!' : 'Not Quite...'}
              </h4>
              <p className={`text-sm mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.feedback}
              </p>
              {result.hint && (
                <p className="text-sm text-gray-700 italic mt-2">
                  💡 {result.hint}
                </p>
              )}
              {result.success && (
                <div className="mt-3">
                  <span className="inline-flex px-4 py-2 bg-green-600 text-white rounded-full text-sm font-semibold">
                    +{result.points} points earned
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-5">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Solution Explanation
          </h4>
          <div className="mb-3">
            <div className="text-xs font-semibold text-blue-900 mb-2">Solution:</div>
            <CodeBlock code={challenge.solution} language="html" />
          </div>
          <p className="text-sm text-blue-900">{challenge.explanation}</p>
        </div>
      )}

      {/* Reveal solution button for completed challenges */}
      {isCompleted && !showSolution && (
        <button
          onClick={handleRevealSolution}
          className="w-full py-2 text-primary-600 border-2 border-primary-200 rounded-lg hover:bg-primary-50 transition font-semibold"
        >
          Show Solution
        </button>
      )}
    </div>
  );
}
