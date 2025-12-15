// CSP Parser and Validation Utility
// Handles parsing, validation, and testing of Content Security Policy headers

import { cspDirectives, validSources } from '../data/csp-directives';

/**
 * Parse a CSP header string into a structured object
 * @param {string} cspHeader - Raw CSP header string
 * @returns {Object} Parsed CSP with directives and their values
 */
export function parseCSP(cspHeader) {
  if (!cspHeader || typeof cspHeader !== 'string') {
    return { directives: {}, raw: '', errors: ['Invalid CSP header'] };
  }

  const directives = {};
  const errors = [];
  const warnings = [];

  // Split by semicolon to get individual directives
  const directiveStrings = cspHeader.split(';').map(s => s.trim()).filter(Boolean);

  directiveStrings.forEach((directiveString, index) => {
    // Split directive into name and values
    const parts = directiveString.trim().split(/\s+/);
    const directiveName = parts[0];
    const values = parts.slice(1);

    // Validate directive name
    if (!cspDirectives[directiveName]) {
      warnings.push(`Unknown directive: ${directiveName} (this may be valid but not in our database)`);
    }

    // Check for deprecated directives
    if (cspDirectives[directiveName]?.deprecated) {
      warnings.push(`Deprecated directive: ${directiveName}`);
    }

    // Store directive and its values
    directives[directiveName] = {
      name: directiveName,
      values: values,
      raw: directiveString,
      index: index
    };

    // Validate source values for fetch directives
    if (cspDirectives[directiveName]?.category === 'fetch') {
      values.forEach(value => {
        validateSourceValue(value, directiveName, warnings);
      });
    }
  });

  // Check for common misconfigurations
  const configWarnings = checkMisconfigurations(directives);
  warnings.push(...configWarnings);

  return {
    directives,
    raw: cspHeader,
    errors: errors.length > 0 ? errors : null,
    warnings: warnings.length > 0 ? warnings : null
  };
}

/**
 * Validate a source value
 * @param {string} value - Source value to validate
 * @param {string} directiveName - Parent directive name
 * @param {Array} warnings - Array to push warnings to
 */
function validateSourceValue(value, directiveName, warnings) {
  // Check for unsafe values
  if (value === "'unsafe-inline'" && (directiveName === 'script-src' || directiveName === 'style-src')) {
    warnings.push(`${directiveName} contains 'unsafe-inline' - this defeats XSS protection`);
  }

  if (value === "'unsafe-eval'" && directiveName === 'script-src') {
    warnings.push(`${directiveName} contains 'unsafe-eval' - this allows eval() and is dangerous`);
  }

  // Check for overly permissive wildcards
  if (value === '*') {
    warnings.push(`${directiveName} contains wildcard (*) - this allows any source`);
  }

  // Check for http: scheme in production
  if (value === 'http:') {
    warnings.push(`${directiveName} allows HTTP sources - prefer HTTPS for security`);
  }
}

/**
 * Check for common CSP misconfigurations
 * @param {Object} directives - Parsed directives object
 * @returns {Array} Array of warning messages
 */
function checkMisconfigurations(directives) {
  const warnings = [];

  // Check if base-uri is missing
  if (!directives['base-uri']) {
    warnings.push("Missing 'base-uri' directive - vulnerable to base tag injection attacks");
  }

  // Check if object-src is not set to none
  if (!directives['object-src']) {
    warnings.push("Missing 'object-src' directive - consider setting to 'none' unless you need plugins");
  }

  // Check for sandbox with both allow-scripts and allow-same-origin
  if (directives['sandbox']) {
    const sandboxValues = directives['sandbox'].values;
    if (sandboxValues.includes('allow-scripts') && sandboxValues.includes('allow-same-origin')) {
      warnings.push("Sandbox with both 'allow-scripts' and 'allow-same-origin' defeats the sandbox");
    }
  }

  // Check if default-src is too permissive
  if (directives['default-src']) {
    const defaultValues = directives['default-src'].values;
    if (defaultValues.includes('*') || defaultValues.includes('https:') || defaultValues.includes('http:')) {
      warnings.push("'default-src' is very permissive - consider restricting to specific sources");
    }
  }

  // Check for missing default-src
  if (!directives['default-src']) {
    warnings.push("Consider adding 'default-src' as a fallback for undefined directives");
  }

  return warnings;
}

/**
 * Test if a payload would be blocked by a CSP policy
 * @param {string} payload - XSS payload to test
 * @param {Object} parsedCSP - Parsed CSP object from parseCSP()
 * @returns {Object} Test result with blocked status and reason
 */
export function testPayloadAgainstCSP(payload, parsedCSP) {
  const { directives } = parsedCSP;

  // Determine what type of payload this is
  const payloadType = detectPayloadType(payload);

  // Get the relevant directive
  const relevantDirective = getRelevantDirective(payloadType, directives);

  if (!relevantDirective) {
    return {
      blocked: false,
      reason: `No relevant CSP directive found for ${payloadType} payload`,
      severity: 'high',
      recommendation: `Add a ${payloadType === 'script' ? 'script-src' : payloadType + '-src'} directive to block this`
    };
  }

  // Check if payload would be blocked
  const blockResult = checkIfBlocked(payload, payloadType, relevantDirective, directives);

  return blockResult;
}

/**
 * Detect what type of XSS payload this is
 * @param {string} payload - XSS payload
 * @returns {string} Payload type (script, style, img, iframe, etc.)
 */
function detectPayloadType(payload) {
  const lower = payload.toLowerCase();

  if (lower.includes('<script') || lower.includes('javascript:') ||
      lower.includes('eval(') || lower.includes('onerror=') ||
      lower.includes('onload=') || lower.includes('onclick=')) {
    return 'script';
  }

  if (lower.includes('<style') || lower.includes('@import')) {
    return 'style';
  }

  if (lower.includes('<img') || lower.includes('<image')) {
    return 'img';
  }

  if (lower.includes('<iframe') || lower.includes('<frame')) {
    return 'frame';
  }

  if (lower.includes('<object') || lower.includes('<embed') || lower.includes('<applet')) {
    return 'object';
  }

  if (lower.includes('<svg')) {
    return 'img'; // SVG images are covered by img-src
  }

  if (lower.includes('<video') || lower.includes('<audio')) {
    return 'media';
  }

  if (lower.includes('<base')) {
    return 'base';
  }

  if (lower.includes('<form')) {
    return 'form';
  }

  return 'script'; // Default to script for unknown payloads
}

/**
 * Get the relevant CSP directive for a payload type
 * @param {string} payloadType - Type of payload
 * @param {Object} directives - All CSP directives
 * @returns {Object|null} Relevant directive object
 */
function getRelevantDirective(payloadType, directives) {
  const directiveMap = {
    'script': 'script-src',
    'style': 'style-src',
    'img': 'img-src',
    'frame': 'frame-src',
    'object': 'object-src',
    'media': 'media-src',
    'base': 'base-uri',
    'form': 'form-action'
  };

  const directiveName = directiveMap[payloadType];

  // Return the specific directive or fall back to default-src
  return directives[directiveName] || directives['default-src'] || null;
}

/**
 * Check if a payload would be blocked by a directive
 * @param {string} payload - XSS payload
 * @param {string} payloadType - Type of payload
 * @param {Object} directive - CSP directive to check against
 * @param {Object} allDirectives - All directives (for fallback checks)
 * @returns {Object} Block result
 */
function checkIfBlocked(payload, payloadType, directive, allDirectives) {
  const { values } = directive;

  // Check for none - blocks everything
  if (values.includes("'none'")) {
    return {
      blocked: true,
      reason: `${directive.name} is set to 'none' - all ${payloadType} sources blocked`,
      severity: 'low',
      directive: directive.name
    };
  }

  // Check for unsafe-inline (scripts/styles)
  if (payloadType === 'script' || payloadType === 'style') {
    const isInline = !payload.includes('src=') && !payload.includes('href=');

    if (isInline && !values.includes("'unsafe-inline'") && !hasNonce(payload, values) && !hasHash(payload, values)) {
      return {
        blocked: true,
        reason: `Inline ${payloadType} blocked - no 'unsafe-inline', nonce, or hash in ${directive.name}`,
        severity: 'low',
        directive: directive.name
      };
    }

    if (isInline && values.includes("'unsafe-inline'")) {
      return {
        blocked: false,
        reason: `Inline ${payloadType} allowed due to 'unsafe-inline' in ${directive.name}`,
        severity: 'high',
        directive: directive.name,
        recommendation: "Remove 'unsafe-inline' and use nonces or hashes for better security"
      };
    }
  }

  // Check for unsafe-eval
  if (payloadType === 'script' && (payload.includes('eval(') || payload.includes('Function('))) {
    if (!values.includes("'unsafe-eval'")) {
      return {
        blocked: true,
        reason: `eval() blocked - no 'unsafe-eval' in ${directive.name}`,
        severity: 'low',
        directive: directive.name
      };
    } else {
      return {
        blocked: false,
        reason: `eval() allowed due to 'unsafe-eval' in ${directive.name}`,
        severity: 'high',
        directive: directive.name,
        recommendation: "Remove 'unsafe-eval' - it's a major security risk"
      };
    }
  }

  // For external sources
  if (payload.includes('src=') || payload.includes('href=')) {
    const externalSource = extractSource(payload);

    if (externalSource) {
      const sourceAllowed = checkSourceAllowed(externalSource, values);

      if (!sourceAllowed) {
        return {
          blocked: true,
          reason: `External source '${externalSource}' not whitelisted in ${directive.name}`,
          severity: 'low',
          directive: directive.name
        };
      } else {
        return {
          blocked: false,
          reason: `External source '${externalSource}' is whitelisted in ${directive.name}`,
          severity: 'medium',
          directive: directive.name
        };
      }
    }
  }

  // Default to allowed if no specific block found (conservative approach)
  return {
    blocked: false,
    reason: `Payload may be allowed by current ${directive.name} policy`,
    severity: 'medium',
    directive: directive.name,
    recommendation: 'Review your CSP policy for potential bypasses'
  };
}

/**
 * Check if payload has a matching nonce
 * @param {string} payload - XSS payload
 * @param {Array} values - CSP source values
 * @returns {boolean} True if nonce matches
 */
function hasNonce(payload, values) {
  // Extract nonce from payload
  const nonceMatch = payload.match(/nonce=['"]([^'"]+)['"]/);
  if (!nonceMatch) return false;

  const payloadNonce = nonceMatch[1];

  // Check if any value is a matching nonce
  return values.some(value => value.startsWith("'nonce-") && value.includes(payloadNonce));
}

/**
 * Check if payload has a matching hash
 * @param {string} payload - XSS payload
 * @param {Array} values - CSP source values
 * @returns {boolean} True if hash matches
 */
function hasHash(payload, values) {
  // Simplified - would need actual hash calculation in real implementation
  return values.some(value =>
    value.startsWith("'sha256-") ||
    value.startsWith("'sha384-") ||
    value.startsWith("'sha512-")
  );
}

/**
 * Extract source URL from payload
 * @param {string} payload - XSS payload
 * @returns {string|null} Extracted source URL
 */
function extractSource(payload) {
  const srcMatch = payload.match(/src=['"]([^'"]+)['"]/i) ||
                   payload.match(/href=['"]([^'"]+)['"]/i);

  return srcMatch ? srcMatch[1] : null;
}

/**
 * Check if a source is allowed by CSP values
 * @param {string} source - Source URL to check
 * @param {Array} values - CSP source values
 * @returns {boolean} True if source is allowed
 */
function checkSourceAllowed(source, values) {
  // Check for wildcard
  if (values.includes('*')) return true;

  // Check for scheme wildcards
  if (source.startsWith('https:') && values.includes('https:')) return true;
  if (source.startsWith('http:') && values.includes('http:')) return true;
  if (source.startsWith('data:') && values.includes('data:')) return true;
  if (source.startsWith('blob:') && values.includes('blob:')) return true;

  // Check for self (simplified - would need to know current origin)
  if (values.includes("'self'")) {
    // In a real implementation, check if source matches current origin
    // For now, assume external sources don't match 'self'
    if (source.startsWith('http://') || source.startsWith('https://')) {
      return false;
    }
    return true; // Relative URLs are self
  }

  // Check for exact domain matches
  try {
    const sourceURL = new URL(source, 'https://example.com');
    const sourceHost = sourceURL.host;

    for (const value of values) {
      // Skip special keywords
      if (value.startsWith("'")) continue;

      try {
        const allowedURL = new URL(value);
        const allowedHost = allowedURL.host;

        // Check for exact match or wildcard subdomain
        if (allowedHost === sourceHost) return true;
        if (allowedHost.startsWith('*.') && sourceHost.endsWith(allowedHost.slice(2))) return true;
      } catch {
        // Not a valid URL, might be a domain without scheme
        if (value.includes(sourceHost)) return true;
      }
    }
  } catch {
    // Not a valid URL
  }

  return false;
}

/**
 * Generate a CSP header string from selected options
 * @param {Object} options - Directive options {directiveName: [values]}
 * @returns {string} Generated CSP header
 */
export function generateCSP(options) {
  const directives = [];

  for (const [directiveName, values] of Object.entries(options)) {
    if (values && values.length > 0) {
      const directiveString = `${directiveName} ${values.join(' ')}`;
      directives.push(directiveString);
    }
  }

  return directives.join('; ');
}

/**
 * Calculate a security score for a CSP policy
 * @param {Object} parsedCSP - Parsed CSP object
 * @returns {Object} Score and rating
 */
export function calculateSecurityScore(parsedCSP) {
  let score = 100;
  const issues = [];

  const { directives, warnings } = parsedCSP;

  // Deduct points for unsafe directives
  Object.entries(directives).forEach(([name, directive]) => {
    if (directive.values.includes("'unsafe-inline'")) {
      score -= 15;
      issues.push(`${name} uses 'unsafe-inline' (-15 points)`);
    }

    if (directive.values.includes("'unsafe-eval'")) {
      score -= 15;
      issues.push(`${name} uses 'unsafe-eval' (-15 points)`);
    }

    if (directive.values.includes('*')) {
      score -= 10;
      issues.push(`${name} uses wildcard (*) (-10 points)`);
    }

    if (directive.values.includes('http:')) {
      score -= 10;
      issues.push(`${name} allows HTTP (-10 points)`);
    }
  });

  // Deduct points for missing important directives
  if (!directives['base-uri']) {
    score -= 5;
    issues.push("Missing 'base-uri' directive (-5 points)");
  }

  if (!directives['object-src']) {
    score -= 3;
    issues.push("Missing 'object-src' directive (-3 points)");
  }

  if (!directives['default-src'] && !directives['script-src']) {
    score -= 10;
    issues.push("Missing 'default-src' or 'script-src' directive (-10 points)");
  }

  // Bonus points for good practices
  if (directives['script-src']?.values.some(v => v.startsWith("'nonce-"))) {
    score += 5;
    issues.push("Uses nonces for scripts (+5 points)");
  }

  if (directives['base-uri']?.values.includes("'none'") || directives['base-uri']?.values.includes("'self'")) {
    score += 3;
    issues.push("Restricts base-uri (+3 points)");
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Determine rating
  let rating, color;
  if (score >= 80) {
    rating = 'Excellent';
    color = 'green';
  } else if (score >= 60) {
    rating = 'Good';
    color = 'blue';
  } else if (score >= 40) {
    rating = 'Fair';
    color = 'yellow';
  } else if (score >= 20) {
    rating = 'Poor';
    color = 'orange';
  } else {
    rating = 'Weak';
    color = 'red';
  }

  return {
    score,
    rating,
    color,
    issues
  };
}
