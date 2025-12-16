/**
 * Quiz Component
 *
 * Multiple choice quiz with instant feedback
 */

import { useState } from 'react';
import { calculateQuizScore } from '../../utils/challenge-validator';
import { ProgressManager } from '../../utils/progress-manager';

export default function Quiz({ questions, lessonId, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    if (submitted) return;

    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  const handleSubmit = () => {
    // Convert answers object to array
    const answersArray = questions.map((_, index) => answers[index]);

    // Calculate score
    const quizResults = calculateQuizScore(questions, answersArray);
    setResults(quizResults);
    setSubmitted(true);

    // Save quiz score
    if (quizResults.passed) {
      ProgressManager.completeLesson(lessonId, quizResults.score);
    }

    // Notify parent
    if (onComplete) {
      onComplete(quizResults);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setResults(null);
  };

  const allAnswered = questions.every((_, index) => answers[index] !== undefined);

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Check</h3>
        <p className="text-gray-600">
          Test your understanding with {questions.length} multiple choice questions.
          You need 70% to pass.
        </p>
      </div>

      {/* Questions */}
      {questions.map((question, qIndex) => {
        const selectedAnswer = answers[qIndex];
        const isCorrect = results?.results[qIndex]?.correct;

        return (
          <div
            key={question.id || qIndex}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 ${
              submitted
                ? isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
                : 'border-gray-200'
            }`}
          >
            {/* Question */}
            <div className="mb-4">
              <div className="flex items-start justify-between">
                <h4 className="text-lg font-semibold text-gray-900">
                  {qIndex + 1}. {question.question}
                </h4>
                {submitted && (
                  <div className="flex-shrink-0 ml-4">
                    {isCorrect ? (
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, oIndex) => {
                const isSelected = selectedAnswer === oIndex;
                const isCorrectAnswer = question.correctAnswer === oIndex;
                const showCorrectAnswer = submitted && isCorrectAnswer;
                const showIncorrectSelection = submitted && isSelected && !isCorrect;

                return (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, oIndex)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      submitted
                        ? showCorrectAnswer
                          ? 'border-green-400 bg-green-100'
                          : showIncorrectSelection
                          ? 'border-red-400 bg-red-100'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-primary-400 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                        submitted
                          ? showCorrectAnswer
                            ? 'border-green-600 bg-green-600'
                            : showIncorrectSelection
                            ? 'border-red-600 bg-red-600'
                            : 'border-gray-300'
                          : isSelected
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-gray-300'
                      }`}>
                        {(isSelected || showCorrectAnswer) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className={`${
                        submitted && (showCorrectAnswer || showIncorrectSelection)
                          ? 'font-semibold'
                          : ''
                      }`}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {submitted && question.explanation && (
              <div className={`mt-4 p-4 rounded-lg border-l-4 ${
                isCorrect
                  ? 'bg-green-50 border-green-400'
                  : 'bg-blue-50 border-blue-400'
              }`}>
                <p className={`text-sm font-semibold mb-1 ${
                  isCorrect ? 'text-green-900' : 'text-blue-900'
                }`}>
                  {isCorrect ? 'Correct!' : 'Explanation:'}
                </p>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Submit/Results */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold text-lg flex items-center justify-center"
        >
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {allAnswered ? 'Submit Quiz' : `Answer all ${questions.length} questions to submit`}
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 p-6">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              results.passed
                ? 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              {results.passed ? (
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {results.passed ? 'Quiz Passed!' : 'Keep Practicing'}
            </h3>

            <div className="text-4xl font-bold text-primary-600 mb-4">
              {results.score}%
            </div>

            <p className="text-gray-600 mb-6">
              You got {results.correct} out of {results.total} questions correct.
              {results.passed
                ? ' Great job!'
                : ' You need 70% to pass. Review the lesson material and try again.'}
            </p>

            {!results.passed && (
              <button
                onClick={handleRetry}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
              >
                Retry Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
