/**
 * Challenge Validator
 *
 * Validates user-submitted XSS payloads against challenge requirements.
 * Integrates with existing filters, contexts, and XSS detection utilities.
 */

import { detectXSS } from './xss-detector';
import { filters } from '../data/filters';
import { contexts } from '../data/contexts';

/**
 * Validate a challenge solution
 * @param {object} challenge - Challenge definition
 * @param {string} payload - User's payload
 * @returns {object} Validation result
 */
export function validateChallenge(challenge, payload) {
  if (!payload || payload.trim() === '') {
    return {
      success: false,
      reason: 'Empty payload',
      feedback: 'Please enter a payload to test'
    };
  }

  const { validation, scenario } = challenge;

  // Apply filter from scenario
  const filter = filters[scenario.filterType];
  if (!filter) {
    console.error(`Unknown filter type: ${scenario.filterType}`);
    return {
      success: false,
      reason: 'Invalid challenge configuration',
      feedback: 'Challenge has invalid filter configuration'
    };
  }

  const filtered = filter.apply(payload);

  // Apply context template
  const context = contexts[scenario.context];
  if (!context) {
    console.error(`Unknown context: ${scenario.context}`);
    return {
      success: false,
      reason: 'Invalid challenge configuration',
      feedback: 'Challenge has invalid context configuration'
    };
  }

  const contextual = context.template(filtered);

  // Detect XSS patterns in the filtered payload
  const detection = detectXSS(filtered);
  const wouldExecute = detection.wouldExecute;

  // Pattern-based validation
  if (validation.type === 'pattern-match') {
    // Check banned patterns first
    if (validation.bannedPatterns) {
      const bannedMatch = validation.bannedPatterns.find(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(payload);
      });

      if (bannedMatch) {
        return {
          success: false,
          reason: 'Solution uses banned techniques',
          feedback: `This challenge doesn't allow: ${bannedMatch}. Try a different approach.`,
          filtered,
          contextual,
          detection
        };
      }
    }

    // Check required patterns
    if (validation.patterns && validation.requiredAll) {
      const missingPattern = validation.patterns.find(pattern => {
        const regex = new RegExp(pattern, 'i');
        return !regex.test(payload);
      });

      if (missingPattern) {
        return {
          success: false,
          reason: 'Missing required patterns',
          feedback: 'Your payload doesn\'t match the expected pattern. Check the challenge requirements.',
          hint: `Required pattern: ${missingPattern}`,
          filtered,
          contextual,
          detection
        };
      }
    }

    // Check if at least one pattern matches
    if (validation.patterns && !validation.requiredAll) {
      const hasMatch = validation.patterns.some(pattern => {
        const regex = new RegExp(pattern, 'i');
        return regex.test(payload);
      });

      if (!hasMatch) {
        return {
          success: false,
          reason: 'No matching patterns',
          feedback: 'Your payload doesn\'t match any of the expected patterns',
          filtered,
          contextual,
          detection
        };
      }
    }
  }

  // Custom function validation
  if (validation.type === 'custom-function') {
    try {
      const result = validation.validator(payload, filtered, wouldExecute);

      if (!result) {
        return {
          success: false,
          reason: 'Custom validation failed',
          feedback: 'Your solution doesn\'t meet the challenge requirements. Review the challenge description.',
          filtered,
          contextual,
          detection
        };
      }
    } catch (error) {
      console.error('Custom validator error:', error);
      return {
        success: false,
        reason: 'Validation error',
        feedback: 'An error occurred while validating your solution',
        filtered,
        contextual,
        detection
      };
    }
  }

  // Check if execution is required
  if (validation.checkExecution && !wouldExecute) {
    return {
      success: false,
      reason: 'Payload would not execute',
      feedback: 'Your payload was blocked or sanitized and would not execute JavaScript.',
      hint: 'Try a different technique that bypasses the filter',
      filtered,
      contextual,
      detection
    };
  }

  // All validations passed
  return {
    success: true,
    points: challenge.points,
    feedback: 'Challenge completed successfully!',
    explanation: 'Your payload successfully bypassed the filter and would execute.',
    filtered,
    contextual,
    detection
  };
}

/**
 * Calculate points with penalties
 * @param {number} basePoints - Base points for the challenge
 * @param {number} attempts - Number of attempts
 * @param {number} hintsUsed - Number of hints used
 * @returns {number} Final points (minimum 5)
 */
export function calculatePoints(basePoints, attempts = 1, hintsUsed = 0) {
  // Penalty: -5 points per hint, -2 points per attempt (after first)
  const hintPenalty = hintsUsed * 5;
  const attemptPenalty = Math.max(0, attempts - 1) * 2;

  const finalPoints = Math.max(
    5, // Minimum 5 points
    basePoints - hintPenalty - attemptPenalty
  );

  return finalPoints;
}

/**
 * Validate quiz answer
 * @param {object} question - Question object
 * @param {number} selectedIndex - Selected answer index
 * @returns {object} Validation result
 */
export function validateQuizAnswer(question, selectedIndex) {
  const isCorrect = selectedIndex === question.correctAnswer;

  return {
    correct: isCorrect,
    explanation: question.explanation,
    correctAnswer: question.correctAnswer
  };
}

/**
 * Calculate quiz score
 * @param {array} questions - Array of quiz questions
 * @param {array} answers - Array of user answers (indices)
 * @returns {object} Quiz results
 */
export function calculateQuizScore(questions, answers) {
  if (questions.length !== answers.length) {
    throw new Error('Questions and answers arrays must have the same length');
  }

  const results = questions.map((question, index) => {
    const answer = answers[index];
    return validateQuizAnswer(question, answer);
  });

  const correctCount = results.filter(r => r.correct).length;
  const score = Math.round((correctCount / questions.length) * 100);

  return {
    score,
    correct: correctCount,
    total: questions.length,
    passed: score >= 70, // 70% passing grade
    results
  };
}
