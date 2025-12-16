/**
 * LocalStorage schema for Learning Paths progress tracking
 *
 * This defines the structure of data stored in browser localStorage
 * to track user progress through learning paths, lessons, and challenges.
 */

export const progressSchema = {
  version: '1.0.0',
  lastUpdated: null,

  // Progress by learning path
  paths: {
    // pathId: {
    //   status: 'not-started' | 'in-progress' | 'completed',
    //   startedAt: timestamp,
    //   completedAt: timestamp,
    //   progress: 0-100 (percentage)
    // }
  },

  // Lesson completion tracking
  lessons: {
    // lessonId: {
    //   status: 'not-started' | 'in-progress' | 'completed',
    //   startedAt: timestamp,
    //   completedAt: timestamp,
    //   timeSpent: minutes,
    //   quizScore: 0-100,
    //   challengesCompleted: ['challengeId', ...]
    // }
  },

  // Challenge solutions and attempts
  challenges: {
    // challengeId: {
    //   attempts: number,
    //   completed: boolean,
    //   completedAt: timestamp,
    //   solution: string (user's solution),
    //   points: number (earned points),
    //   hintsUsed: number
    // }
  },

  // Overall statistics
  stats: {
    totalPoints: 0,
    challengesCompleted: 0,
    lessonsCompleted: 0,
    pathsCompleted: 0,
    totalTimeSpent: 0,
    streak: 0,
    lastActiveDate: null
  }
};

// localStorage key
export const STORAGE_KEY = 'xss-page-learning-progress';

// Status constants
export const STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};
