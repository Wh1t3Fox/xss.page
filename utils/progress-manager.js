/**
 * Progress Manager
 *
 * Manages user progress through learning paths using localStorage.
 * Handles CRUD operations for paths, lessons, challenges, and stats.
 */

import { STORAGE_KEY, progressSchema, STATUS } from '../data/progress-schema';

export const ProgressManager = {
  /**
   * Load progress from localStorage
   * @returns {object} Progress object
   */
  load() {
    try {
      if (typeof window === 'undefined') return { ...progressSchema, lastUpdated: Date.now() };

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { ...progressSchema, lastUpdated: Date.now() };
      }

      const parsed = JSON.parse(stored);

      // Migrate old versions if needed
      if (parsed.version !== progressSchema.version) {
        console.log('Migrating progress to new version');
        return { ...progressSchema, ...parsed, version: progressSchema.version, lastUpdated: Date.now() };
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load progress:', error);
      return { ...progressSchema, lastUpdated: Date.now() };
    }
  },

  /**
   * Save progress to localStorage
   * @param {object} progress - Progress object to save
   * @returns {boolean} Success status
   */
  save(progress) {
    try {
      if (typeof window === 'undefined') return false;

      progress.lastUpdated = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  },

  /**
   * Start a learning path
   * @param {string} pathId - Path identifier
   * @returns {object} Updated progress
   */
  startPath(pathId) {
    const progress = this.load();

    if (!progress.paths[pathId]) {
      progress.paths[pathId] = {
        status: STATUS.IN_PROGRESS,
        startedAt: Date.now(),
        completedAt: null,
        progress: 0
      };
      this.save(progress);
    }

    return progress;
  },

  /**
   * Start a lesson
   * @param {string} lessonId - Lesson identifier
   * @returns {object} Updated progress
   */
  startLesson(lessonId) {
    const progress = this.load();

    if (!progress.lessons[lessonId]) {
      progress.lessons[lessonId] = {
        status: STATUS.IN_PROGRESS,
        startedAt: Date.now(),
        completedAt: null,
        timeSpent: 0,
        quizScore: null,
        challengesCompleted: []
      };
      this.save(progress);
    }

    return progress;
  },

  /**
   * Complete a challenge
   * @param {string} challengeId - Challenge identifier
   * @param {number} points - Points earned
   * @param {string} solution - User's solution
   * @param {number} attempts - Number of attempts
   * @param {number} hintsUsed - Number of hints used
   * @returns {object} Updated progress
   */
  completeChallenge(challengeId, points, solution, attempts = 1, hintsUsed = 0) {
    const progress = this.load();

    // Don't re-award points if already completed
    const alreadyCompleted = progress.challenges[challengeId]?.completed;

    progress.challenges[challengeId] = {
      completed: true,
      completedAt: Date.now(),
      solution,
      points,
      attempts,
      hintsUsed
    };

    // Update stats only if newly completed
    if (!alreadyCompleted) {
      progress.stats.challengesCompleted = (progress.stats.challengesCompleted || 0) + 1;
      progress.stats.totalPoints = (progress.stats.totalPoints || 0) + points;

      // Update streak
      this.updateStreak(progress);
    }

    this.save(progress);
    return progress;
  },

  /**
   * Add challenge to lesson's completed list
   * @param {string} lessonId - Lesson identifier
   * @param {string} challengeId - Challenge identifier
   * @returns {object} Updated progress
   */
  addChallengeToLesson(lessonId, challengeId) {
    const progress = this.load();

    if (progress.lessons[lessonId]) {
      if (!progress.lessons[lessonId].challengesCompleted) {
        progress.lessons[lessonId].challengesCompleted = [];
      }

      if (!progress.lessons[lessonId].challengesCompleted.includes(challengeId)) {
        progress.lessons[lessonId].challengesCompleted.push(challengeId);
      }

      this.save(progress);
    }

    return progress;
  },

  /**
   * Complete a lesson
   * @param {string} lessonId - Lesson identifier
   * @param {number} quizScore - Quiz score (0-100)
   * @returns {object} Updated progress
   */
  completeLesson(lessonId, quizScore = null) {
    const progress = this.load();

    const alreadyCompleted = progress.lessons[lessonId]?.status === STATUS.COMPLETED;

    progress.lessons[lessonId] = {
      ...progress.lessons[lessonId],
      status: STATUS.COMPLETED,
      completedAt: Date.now(),
      quizScore
    };

    if (!alreadyCompleted) {
      progress.stats.lessonsCompleted = (progress.stats.lessonsCompleted || 0) + 1;
    }

    this.save(progress);
    return progress;
  },

  /**
   * Complete a path
   * @param {string} pathId - Path identifier
   * @returns {object} Updated progress
   */
  completePath(pathId) {
    const progress = this.load();

    const alreadyCompleted = progress.paths[pathId]?.status === STATUS.COMPLETED;

    progress.paths[pathId] = {
      ...progress.paths[pathId],
      status: STATUS.COMPLETED,
      completedAt: Date.now(),
      progress: 100
    };

    if (!alreadyCompleted) {
      progress.stats.pathsCompleted = (progress.stats.pathsCompleted || 0) + 1;
    }

    this.save(progress);
    return progress;
  },

  /**
   * Check if a lesson is complete
   * @param {string} lessonId - Lesson identifier
   * @param {object} lesson - Lesson definition
   * @returns {boolean} Completion status
   */
  isLessonComplete(lessonId, lesson) {
    const progress = this.load();
    const lessonProgress = progress.lessons[lessonId];

    if (!lessonProgress) return false;

    // Check all challenges completed
    const allChallengesComplete = lesson.challenges.every(challengeId =>
      progress.challenges[challengeId]?.completed
    );

    // Check quiz passed (if exists, requires 70% or higher)
    const quizPassed = !lesson.quiz || lessonProgress.quizScore >= 70;

    return allChallengesComplete && quizPassed;
  },

  /**
   * Calculate path progress percentage
   * @param {string} pathId - Path identifier
   * @param {object} path - Path definition with lessons
   * @returns {number} Progress percentage (0-100)
   */
  getPathProgress(pathId, path) {
    const progress = this.load();

    if (!path.lessons || path.lessons.length === 0) return 0;

    const completedLessons = path.lessons.filter(lessonId =>
      progress.lessons[lessonId]?.status === STATUS.COMPLETED
    ).length;

    return Math.round((completedLessons / path.lessons.length) * 100);
  },

  /**
   * Update daily streak
   * @param {object} progress - Current progress object
   */
  updateStreak(progress) {
    const today = new Date().toDateString();
    const lastActive = progress.stats.lastActiveDate
      ? new Date(progress.stats.lastActiveDate).toDateString()
      : null;

    if (lastActive === today) {
      // Already active today, no streak update
      return;
    }

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    if (lastActive === yesterday) {
      // Consecutive day - increment streak
      progress.stats.streak = (progress.stats.streak || 0) + 1;
    } else if (lastActive !== today) {
      // Streak broken - reset to 1
      progress.stats.streak = 1;
    }

    progress.stats.lastActiveDate = Date.now();
  },

  /**
   * Get challenge progress
   * @param {string} challengeId - Challenge identifier
   * @returns {object|null} Challenge progress or null
   */
  getChallengeProgress(challengeId) {
    const progress = this.load();
    return progress.challenges[challengeId] || null;
  },

  /**
   * Get lesson progress
   * @param {string} lessonId - Lesson identifier
   * @returns {object|null} Lesson progress or null
   */
  getLessonProgress(lessonId) {
    const progress = this.load();
    return progress.lessons[lessonId] || null;
  },

  /**
   * Get path progress object
   * @param {string} pathId - Path identifier
   * @returns {object|null} Path progress or null
   */
  getPathProgressObject(pathId) {
    const progress = this.load();
    return progress.paths[pathId] || null;
  },

  /**
   * Export progress as JSON string
   * @returns {string} JSON string of progress
   */
  export() {
    return JSON.stringify(this.load(), null, 2);
  },

  /**
   * Import progress from JSON string
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} Success status
   */
  import(jsonString) {
    try {
      const imported = JSON.parse(jsonString);

      // Validate structure
      if (!imported.version || !imported.stats) {
        throw new Error('Invalid progress data structure');
      }

      this.save(imported);
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  },

  /**
   * Reset all progress
   * @returns {boolean} Success status
   */
  reset() {
    try {
      if (typeof window === 'undefined') return false;
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to reset progress:', error);
      return false;
    }
  },

  /**
   * Get overall stats
   * @returns {object} Stats object
   */
  getStats() {
    const progress = this.load();
    return progress.stats;
  }
};
