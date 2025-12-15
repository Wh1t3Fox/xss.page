// DOM XSS Scanner Utility
// Scans code for dangerous sinks, untrusted sources, and potential data flows

import { dangerousSinks, untrustedSources, safeAlternatives, commonVulnerabilityPatterns } from '../data/dom-patterns';

/**
 * Scan code for DOM XSS vulnerabilities
 * @param {string} code - JavaScript/HTML code to scan
 * @param {string} framework - Framework type (react, vue, angular, vanilla)
 * @returns {Object} Scan results with findings
 */
export function scanCode(code, framework = 'vanilla') {
  const findings = [];
  const detectedSinks = [];
  const detectedSources = [];
  const dataFlows = [];

  // Detect dangerous sinks
  Object.entries(dangerousSinks).forEach(([key, sink]) => {
    // Skip if sink is framework-specific and doesn't match
    if (sink.framework !== 'vanilla' && sink.framework !== framework) {
      return;
    }

    const patterns = generateSinkPatterns(key, sink);

    patterns.forEach(pattern => {
      const matches = findMatches(code, pattern);

      matches.forEach(match => {
        const finding = {
          type: 'sink',
          name: sink.name,
          severity: sink.severity,
          line: match.line,
          column: match.column,
          snippet: match.snippet,
          description: sink.description,
          safeAlternative: sink.safeAlternative,
          cwe: sink.cwe,
          framework: sink.framework
        };

        findings.push(finding);
        detectedSinks.push({
          name: sink.name,
          line: match.line,
          snippet: match.snippet
        });
      });
    });
  });

  // Detect untrusted sources
  Object.entries(untrustedSources).forEach(([key, source]) => {
    const patterns = generateSourcePatterns(key, source);

    patterns.forEach(pattern => {
      const matches = findMatches(code, pattern);

      matches.forEach(match => {
        const finding = {
          type: 'source',
          name: source.name,
          severity: source.severity,
          line: match.line,
          column: match.column,
          snippet: match.snippet,
          description: source.description,
          validation: source.validation
        };

        findings.push(finding);
        detectedSources.push({
          name: source.name,
          line: match.line,
          snippet: match.snippet
        });
      });
    });
  });

  // Detect data flows (source -> sink on same or nearby lines)
  dataFlows.push(...detectDataFlows(detectedSources, detectedSinks, code));

  // Match against common vulnerability patterns
  const knownPatterns = matchCommonPatterns(code);

  return {
    findings,
    detectedSinks,
    detectedSources,
    dataFlows,
    knownPatterns,
    summary: {
      totalFindings: findings.length,
      criticalCount: findings.filter(f => f.severity === 'critical').length,
      highCount: findings.filter(f => f.severity === 'high').length,
      mediumCount: findings.filter(f => f.severity === 'medium').length,
      sinkCount: detectedSinks.length,
      sourceCount: detectedSources.length,
      dataFlowCount: dataFlows.length
    }
  };
}

/**
 * Generate regex patterns for detecting a sink
 */
function generateSinkPatterns(key, sink) {
  const patterns = [];

  if (sink.type === 'property') {
    // Property assignment: element.innerHTML = ...
    patterns.push({
      regex: new RegExp(`\\.${escapeRegex(sink.name)}\\s*=`, 'g'),
      type: 'assignment'
    });
  } else if (sink.type === 'method') {
    // Method call: document.write(...)
    patterns.push({
      regex: new RegExp(`${escapeRegex(sink.name)}\\s*\\(`, 'g'),
      type: 'call'
    });
  } else if (sink.type === 'function') {
    // Function call: eval(...)
    patterns.push({
      regex: new RegExp(`\\b${escapeRegex(sink.name)}\\s*\\(`, 'g'),
      type: 'call'
    });
  } else if (sink.type === 'constructor') {
    // Constructor: new Function(...)
    patterns.push({
      regex: new RegExp(`new\\s+${escapeRegex(sink.name)}\\s*\\(`, 'g'),
      type: 'constructor'
    });
  } else if (sink.type === 'prop') {
    // React prop: dangerouslySetInnerHTML=
    patterns.push({
      regex: new RegExp(`${escapeRegex(sink.name)}\\s*=`, 'g'),
      type: 'prop'
    });
  } else if (sink.type === 'directive') {
    // Vue directive: v-html=
    patterns.push({
      regex: new RegExp(`${escapeRegex(sink.name)}\\s*=`, 'g'),
      type: 'directive'
    });
  } else if (sink.type === 'binding') {
    // Angular binding: [innerHTML]=
    patterns.push({
      regex: new RegExp(`\\${escapeRegex(sink.name)}\\s*=`, 'g'),
      type: 'binding'
    });
  }

  return patterns;
}

/**
 * Generate regex patterns for detecting a source
 */
function generateSourcePatterns(key, source) {
  const patterns = [];

  if (source.type === 'property') {
    // Property access: location.hash, window.name
    patterns.push({
      regex: new RegExp(`\\b${escapeRegex(source.name)}\\b`, 'g'),
      type: 'property'
    });
  } else if (source.type === 'event') {
    // Event data: e.data, event.data
    patterns.push({
      regex: new RegExp(`\\b(e|event)\\.data\\b`, 'g'),
      type: 'event'
    });
  } else if (source.type === 'api') {
    // API usage: localStorage.getItem, sessionStorage
    patterns.push({
      regex: new RegExp(`\\b${escapeRegex(source.name)}`, 'g'),
      type: 'api'
    });
  }

  return patterns;
}

/**
 * Find pattern matches in code with line numbers
 */
function findMatches(code, pattern) {
  const matches = [];
  const lines = code.split('\n');

  lines.forEach((line, lineIndex) => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);

    while ((match = regex.exec(line)) !== null) {
      matches.push({
        line: lineIndex + 1,
        column: match.index + 1,
        snippet: line.trim(),
        matchText: match[0]
      });
    }
  });

  return matches;
}

/**
 * Detect potential data flows from sources to sinks
 */
function detectDataFlows(sources, sinks, code) {
  const flows = [];
  const lines = code.split('\n');

  sources.forEach(source => {
    sinks.forEach(sink => {
      // Check if source and sink are on same line or within 5 lines
      const lineDiff = Math.abs(source.line - sink.line);

      if (lineDiff <= 5) {
        // Look for variable flow
        const sourceSnippet = lines[source.line - 1] || '';
        const sinkSnippet = lines[sink.line - 1] || '';

        // Simple heuristic: look for shared variable names
        const variableMatch = findSharedVariables(sourceSnippet, sinkSnippet);

        if (variableMatch || lineDiff === 0) {
          flows.push({
            source: source.name,
            sink: sink.name,
            sourceLine: source.line,
            sinkLine: sink.line,
            distance: lineDiff,
            confidence: lineDiff === 0 ? 'high' : lineDiff <= 2 ? 'medium' : 'low',
            description: `Potential data flow from ${source.name} to ${sink.name}`,
            severity: 'critical'
          });
        }
      }
    });
  });

  return flows;
}

/**
 * Find shared variables between two code snippets
 */
function findSharedVariables(snippet1, snippet2) {
  // Extract potential variable names (simplified)
  const varPattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;

  const vars1 = new Set();
  let match;

  while ((match = varPattern.exec(snippet1)) !== null) {
    vars1.add(match[1]);
  }

  varPattern.lastIndex = 0;
  while ((match = varPattern.exec(snippet2)) !== null) {
    if (vars1.has(match[1]) && !isKeyword(match[1])) {
      return match[1];
    }
  }

  return null;
}

/**
 * Check if word is a JavaScript keyword
 */
function isKeyword(word) {
  const keywords = ['const', 'let', 'var', 'function', 'if', 'else', 'for', 'while', 'return', 'new', 'this', 'true', 'false', 'null', 'undefined'];
  return keywords.includes(word);
}

/**
 * Match code against common vulnerability patterns
 */
function matchCommonPatterns(code) {
  const matched = [];

  commonVulnerabilityPatterns.forEach(pattern => {
    // Simple check: does code contain both source and sink mentions
    if (code.includes(pattern.source) && code.includes(pattern.sink)) {
      matched.push({
        name: pattern.name,
        severity: pattern.severity,
        description: `Potential ${pattern.name} vulnerability detected`,
        example: pattern.example,
        fix: pattern.fix
      });
    }
  });

  return matched;
}

/**
 * Get safe alternatives for a specific sink
 */
export function getSafeAlternatives(sinkName) {
  // Normalize sink name
  const normalized = sinkName.toLowerCase().replace(/[^a-z]/g, '');

  for (const [key, alternatives] of Object.entries(safeAlternatives)) {
    if (key.toLowerCase().replace(/[^a-z]/g, '') === normalized) {
      return alternatives;
    }
  }

  return [];
}

/**
 * Generate remediation advice for a finding
 */
export function getRemediationAdvice(finding) {
  const alternatives = getSafeAlternatives(finding.name);

  if (alternatives.length === 0) {
    return {
      title: 'General Recommendations',
      alternatives: [
        {
          name: 'Input Validation',
          description: 'Validate and sanitize all user input',
          when: 'Always'
        },
        {
          name: 'Output Encoding',
          description: 'Encode data based on context (HTML, JavaScript, URL)',
          when: 'Before rendering user data'
        },
        {
          name: 'Use Security Libraries',
          description: 'Use established libraries like DOMPurify for sanitization',
          when: 'When rendering HTML content'
        }
      ]
    };
  }

  return {
    title: `Safe Alternatives to ${finding.name}`,
    alternatives
  };
}

/**
 * Detect framework from code
 */
export function detectFramework(code) {
  const indicators = {
    react: [
      /import\s+.*from\s+['"]react['"]/,
      /dangerouslySetInnerHTML/,
      /<[A-Z][a-zA-Z0-9]*[\s>]/,  // JSX component
      /className=/
    ],
    vue: [
      /import\s+.*from\s+['"]vue['"]/,
      /v-html/,
      /v-bind/,
      /v-if/,
      /v-for/
    ],
    angular: [
      /import\s+.*from\s+['"]@angular/,
      /\[innerHTML\]/,
      /bypassSecurityTrust/,
      /\*ngIf/,
      /\*ngFor/
    ],
    jquery: [
      /\$\(/,
      /jQuery\(/,
      /\.html\(/,
      /\.append\(/
    ]
  };

  for (const [framework, patterns] of Object.entries(indicators)) {
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        return framework;
      }
    }
  }

  return 'vanilla';
}

/**
 * Escape special regex characters
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculate overall risk score
 */
export function calculateRiskScore(scanResults) {
  let score = 0;

  scanResults.findings.forEach(finding => {
    if (finding.severity === 'critical') score += 10;
    else if (finding.severity === 'high') score += 5;
    else if (finding.severity === 'medium') score += 2;
  });

  // Data flows are especially dangerous
  score += scanResults.dataFlows.length * 15;

  // Known patterns
  score += scanResults.knownPatterns.length * 8;

  return {
    score: Math.min(score, 100),
    level: score >= 50 ? 'critical' : score >= 20 ? 'high' : score >= 10 ? 'medium' : 'low',
    description: getRiskDescription(score)
  };
}

function getRiskDescription(score) {
  if (score >= 50) return 'Critical: Multiple severe vulnerabilities detected';
  if (score >= 20) return 'High: Significant security issues found';
  if (score >= 10) return 'Medium: Some potential vulnerabilities detected';
  return 'Low: Few or no serious issues found';
}
