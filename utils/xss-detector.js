/**
 * Detect potential XSS vectors in a payload
 * NOTE: This is for educational purposes only and is NOT a comprehensive XSS scanner.
 * This uses pattern matching and will have false positives and false negatives.
 *
 * @param {string} payload - The payload to analyze
 * @returns {object} - Detection results with patterns matched
 */
export const detectXSS = (payload) => {
  if (!payload || typeof payload !== 'string') {
    return { wouldExecute: false, patterns: [], disclaimer: true };
  }

  const matchedPatterns = [];

  // Script tags
  if (/<script[\s\S]*?>[\s\S]*?<\/script>/i.test(payload)) {
    matchedPatterns.push('Script tag with content');
  } else if (/<script[\s\S]*?>/i.test(payload)) {
    matchedPatterns.push('Script tag');
  }

  // Event handlers
  const eventHandlers = /on\w+\s*=/i;
  if (eventHandlers.test(payload)) {
    const match = payload.match(/on(\w+)\s*=/i);
    matchedPatterns.push(`Event handler: ${match ? match[1] : 'unknown'}`);
  }

  // JavaScript protocol
  if (/javascript:/i.test(payload)) {
    matchedPatterns.push('JavaScript protocol');
  }

  // Data protocol
  if (/data:text\/html/i.test(payload)) {
    matchedPatterns.push('Data URL (HTML)');
  }

  // Common XSS tags
  const xssTags = [
    { pattern: /<svg[\s\S]*?>/i, name: 'SVG tag' },
    { pattern: /<img[\s\S]*?>/i, name: 'IMG tag' },
    { pattern: /<iframe[\s\S]*?>/i, name: 'IFRAME tag' },
    { pattern: /<object[\s\S]*?>/i, name: 'OBJECT tag' },
    { pattern: /<embed[\s\S]*?>/i, name: 'EMBED tag' },
    { pattern: /<link[\s\S]*?>/i, name: 'LINK tag' },
    { pattern: /<style[\s\S]*?>/i, name: 'STYLE tag' },
    { pattern: /<base[\s\S]*?>/i, name: 'BASE tag' },
    { pattern: /<form[\s\S]*?>/i, name: 'FORM tag' },
    { pattern: /<input[\s\S]*?>/i, name: 'INPUT tag' },
    { pattern: /<button[\s\S]*?>/i, name: 'BUTTON tag' },
    { pattern: /<meta[\s\S]*?>/i, name: 'META tag' }
  ];

  xssTags.forEach(({ pattern, name }) => {
    if (pattern.test(payload)) {
      matchedPatterns.push(name);
    }
  });

  // Expression evaluation
  if (/expression\s*\(/i.test(payload)) {
    matchedPatterns.push('CSS expression (IE)');
  }

  // Import statements
  if (/@import/i.test(payload)) {
    matchedPatterns.push('CSS @import');
  }

  // String breaking attempts
  if (/['"]\s*\+|\\x|\\u[0-9a-f]{4}/i.test(payload)) {
    matchedPatterns.push('String manipulation/encoding');
  }

  // HTML entities that could be decoded
  if (/&#\d+;|&#x[0-9a-f]+;/i.test(payload)) {
    matchedPatterns.push('HTML entities');
  }

  return {
    wouldExecute: matchedPatterns.length > 0,
    patterns: matchedPatterns,
    disclaimer: true,
    confidence: matchedPatterns.length > 0 ? 'medium' : 'low',
    note: 'This is educational pattern matching, not a real security scanner. False positives and negatives are expected.'
  };
};

/**
 * Get a severity level based on detected patterns
 * @param {array} patterns - Array of matched pattern names
 * @returns {string} - Severity level (low, medium, high, critical)
 */
export const getSeverity = (patterns) => {
  if (patterns.length === 0) return 'low';

  const criticalPatterns = ['Script tag', 'IFRAME tag', 'OBJECT tag', 'EMBED tag'];
  const highPatterns = ['Event handler', 'SVG tag', 'JavaScript protocol'];

  const hasCritical = patterns.some(p => criticalPatterns.some(cp => p.includes(cp)));
  const hasHigh = patterns.some(p => highPatterns.some(hp => p.includes(hp)));

  if (hasCritical) return 'critical';
  if (hasHigh || patterns.length >= 3) return 'high';
  if (patterns.length >= 2) return 'medium';
  return 'low';
};
