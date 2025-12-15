/**
 * Payload Fuzzer Utility
 * Generates XSS payload mutations using various encoding and obfuscation techniques
 */

/**
 * HTML Entity Encoding
 * Converts characters to HTML entities (decimal or hex)
 */
function htmlEntityEncode(payload, variant = 'decimal') {
  const mutations = [];

  if (variant === 'decimal') {
    // Full decimal encoding
    const encoded = payload.split('').map(c => `&#${c.charCodeAt(0)};`).join('');
    mutations.push({ payload: encoded, strategy: 'html-entity-decimal', encoding: 'html' });

    // Partial decimal encoding (only special chars)
    const partialEncoded = payload.replace(/[<>"'&]/g, c => `&#${c.charCodeAt(0)};`);
    if (partialEncoded !== payload) {
      mutations.push({ payload: partialEncoded, strategy: 'html-entity-partial-decimal', encoding: 'html' });
    }
  } else if (variant === 'hex') {
    // Full hex encoding
    const encoded = payload.split('').map(c => `&#x${c.charCodeAt(0).toString(16)};`).join('');
    mutations.push({ payload: encoded, strategy: 'html-entity-hex', encoding: 'html' });

    // Partial hex encoding (only special chars)
    const partialEncoded = payload.replace(/[<>"'&]/g, c => `&#x${c.charCodeAt(0).toString(16)};`);
    if (partialEncoded !== payload) {
      mutations.push({ payload: partialEncoded, strategy: 'html-entity-partial-hex', encoding: 'html' });
    }
  }

  return mutations;
}

/**
 * URL Encoding
 * Converts to percent-encoded format
 */
function urlEncode(payload, doubleEncode = false) {
  const mutations = [];

  // Single URL encoding
  const encoded = encodeURIComponent(payload);
  mutations.push({ payload: encoded, strategy: 'url-encoding-single', encoding: 'url' });

  // Double URL encoding
  if (doubleEncode) {
    const doubleEncoded = encodeURIComponent(encoded);
    mutations.push({ payload: doubleEncoded, strategy: 'url-encoding-double', encoding: 'url' });
  }

  // Partial URL encoding (only special chars)
  const partialEncoded = payload.replace(/[<>"'&()]/g, c => encodeURIComponent(c));
  if (partialEncoded !== payload) {
    mutations.push({ payload: partialEncoded, strategy: 'url-encoding-partial', encoding: 'url' });
  }

  return mutations;
}

/**
 * Unicode Escapes
 * Converts to Unicode escape sequences
 */
function unicodeEncode(payload) {
  const mutations = [];

  // \uXXXX format
  const unicodeEscaped = payload.split('').map(c => {
    const code = c.charCodeAt(0);
    return code > 127 || /[<>"'&]/.test(c)
      ? `\\u${code.toString(16).padStart(4, '0')}`
      : c;
  }).join('');
  if (unicodeEscaped !== payload) {
    mutations.push({ payload: unicodeEscaped, strategy: 'unicode-escape', encoding: 'unicode' });
  }

  // \xXX format (for chars < 256)
  const hexEscaped = payload.split('').map(c => {
    const code = c.charCodeAt(0);
    return code > 127 || /[<>"'&]/.test(c)
      ? `\\x${code.toString(16).padStart(2, '0')}`
      : c;
  }).join('');
  if (hexEscaped !== payload) {
    mutations.push({ payload: hexEscaped, strategy: 'hex-escape', encoding: 'unicode' });
  }

  return mutations;
}

/**
 * Base64 Encoding
 */
function base64Encode(payload) {
  const mutations = [];

  try {
    const encoded = Buffer.from(payload).toString('base64');
    // Wrap in data URI for potential execution context
    mutations.push({
      payload: `data:text/html;base64,${encoded}`,
      strategy: 'base64-data-uri',
      encoding: 'base64'
    });

    // Plain base64
    mutations.push({
      payload: encoded,
      strategy: 'base64',
      encoding: 'base64'
    });
  } catch (error) {
    // Skip if encoding fails
  }

  return mutations;
}

/**
 * Case Variations
 * Changes character casing patterns
 */
function caseVariation(payload) {
  const mutations = [];

  // Uppercase
  mutations.push({
    payload: payload.toUpperCase(),
    strategy: 'case-uppercase',
    encoding: 'none'
  });

  // Lowercase
  mutations.push({
    payload: payload.toLowerCase(),
    strategy: 'case-lowercase',
    encoding: 'none'
  });

  // Mixed case (capitalize first letter of each word)
  const mixed = payload.replace(/\b\w/g, c => c.toUpperCase());
  if (mixed !== payload) {
    mutations.push({
      payload: mixed,
      strategy: 'case-mixed',
      encoding: 'none'
    });
  }

  // Alternating case
  let alternate = '';
  for (let i = 0; i < payload.length; i++) {
    alternate += i % 2 === 0 ? payload[i].toLowerCase() : payload[i].toUpperCase();
  }
  if (alternate !== payload) {
    mutations.push({
      payload: alternate,
      strategy: 'case-alternating',
      encoding: 'none'
    });
  }

  return mutations;
}

/**
 * Quote Substitution
 * Replaces quotes with alternatives
 */
function quoteSubstitution(payload) {
  const mutations = [];

  // Check if payload contains quotes
  if (!payload.includes('"') && !payload.includes("'") && !payload.includes('`')) {
    return mutations;
  }

  // Double to single quotes
  if (payload.includes('"')) {
    mutations.push({
      payload: payload.replace(/"/g, "'"),
      strategy: 'quote-single',
      encoding: 'none'
    });
  }

  // Single to double quotes
  if (payload.includes("'")) {
    mutations.push({
      payload: payload.replace(/'/g, '"'),
      strategy: 'quote-double',
      encoding: 'none'
    });
  }

  // To backticks
  if (payload.includes('"') || payload.includes("'")) {
    mutations.push({
      payload: payload.replace(/["']/g, '`'),
      strategy: 'quote-backtick',
      encoding: 'none'
    });
  }

  // Remove quotes (for attribute contexts)
  const noQuotes = payload.replace(/["'`]/g, '');
  if (noQuotes !== payload) {
    mutations.push({
      payload: noQuotes,
      strategy: 'quote-none',
      encoding: 'none'
    });
  }

  return mutations;
}

/**
 * Whitespace Variations
 * Modifies whitespace characters
 */
function whitespaceVariation(payload) {
  const mutations = [];

  // Tab instead of space
  if (payload.includes(' ')) {
    mutations.push({
      payload: payload.replace(/ /g, '\t'),
      strategy: 'whitespace-tab',
      encoding: 'none'
    });

    // Newline instead of space
    mutations.push({
      payload: payload.replace(/ /g, '\n'),
      strategy: 'whitespace-newline',
      encoding: 'none'
    });

    // Multiple spaces
    mutations.push({
      payload: payload.replace(/ /g, '  '),
      strategy: 'whitespace-double',
      encoding: 'none'
    });

    // Form feed
    mutations.push({
      payload: payload.replace(/ /g, '\f'),
      strategy: 'whitespace-formfeed',
      encoding: 'none'
    });
  }

  return mutations;
}

/**
 * Null Byte Injection
 * Inserts null bytes to bypass filters
 */
function nullByteInjection(payload) {
  const mutations = [];

  // Null byte before closing tag
  if (payload.includes('</')) {
    mutations.push({
      payload: payload.replace(/<\//g, '\x00</'),
      strategy: 'null-byte-before-close',
      encoding: 'none'
    });
  }

  // Null byte after opening tag
  if (payload.includes('<')) {
    const withNull = payload.replace(/<(\w+)/g, '<$1\x00');
    if (withNull !== payload) {
      mutations.push({
        payload: withNull,
        strategy: 'null-byte-after-tag',
        encoding: 'none'
      });
    }
  }

  return mutations;
}

/**
 * Comment Insertion
 * Adds HTML/JavaScript comments
 */
function commentInsertion(payload) {
  const mutations = [];

  // HTML comment before
  mutations.push({
    payload: `<!-->${payload}`,
    strategy: 'comment-html-before',
    encoding: 'none'
  });

  // JavaScript comment in script
  if (payload.toLowerCase().includes('script')) {
    const withJsComment = payload.replace(/(<script[^>]*>)/i, '$1/**/');
    if (withJsComment !== payload) {
      mutations.push({
        payload: withJsComment,
        strategy: 'comment-js-after-open',
        encoding: 'none'
      });
    }

    const withLineComment = payload.replace(/(<script[^>]*>)/i, '$1//\n');
    if (withLineComment !== payload) {
      mutations.push({
        payload: withLineComment,
        strategy: 'comment-js-line',
        encoding: 'none'
      });
    }
  }

  return mutations;
}

/**
 * Protocol Variations
 * Modifies protocol handlers
 */
function protocolVariation(payload) {
  const mutations = [];

  // If contains javascript:
  if (payload.toLowerCase().includes('javascript:')) {
    // Add spaces
    mutations.push({
      payload: payload.replace(/javascript:/gi, 'java script:'),
      strategy: 'protocol-space',
      encoding: 'none'
    });

    // vbscript alternative
    mutations.push({
      payload: payload.replace(/javascript:/gi, 'vbscript:'),
      strategy: 'protocol-vbscript',
      encoding: 'none'
    });

    // data URI
    mutations.push({
      payload: payload.replace(/javascript:/gi, 'data:text/html,'),
      strategy: 'protocol-data',
      encoding: 'none'
    });
  }

  // If contains src= or href=
  if (payload.includes('src=') || payload.includes('href=')) {
    // Add javascript: protocol
    const withProtocol = payload.replace(/(src|href)=/gi, '$1=javascript:');
    if (withProtocol !== payload) {
      mutations.push({
        payload: withProtocol,
        strategy: 'protocol-javascript-inject',
        encoding: 'none'
      });
    }
  }

  return mutations;
}

/**
 * Obfuscation Techniques
 * Advanced obfuscation methods
 */
function obfuscate(payload) {
  const mutations = [];

  // String concatenation (JavaScript)
  if (payload.includes('alert')) {
    mutations.push({
      payload: payload.replace(/alert/g, "'al'+'ert'"),
      strategy: 'obfuscation-concat',
      encoding: 'none'
    });

    // Template literals
    mutations.push({
      payload: payload.replace(/alert/g, '`alert`'),
      strategy: 'obfuscation-template',
      encoding: 'none'
    });

    // Hex string
    mutations.push({
      payload: payload.replace(/alert/g, '\\x61\\x6c\\x65\\x72\\x74'),
      strategy: 'obfuscation-hex-string',
      encoding: 'none'
    });
  }

  // Self-closing tag variation
  if (payload.includes('/>')) {
    mutations.push({
      payload: payload.replace(/\/>/g, '>'),
      strategy: 'obfuscation-remove-self-close',
      encoding: 'none'
    });
  } else if (payload.match(/<(img|input|br|hr)[^>]*>/i)) {
    const withSelfClose = payload.replace(/<(img|input|br|hr)([^>]*)>/gi, '<$1$2/>');
    if (withSelfClose !== payload) {
      mutations.push({
        payload: withSelfClose,
        strategy: 'obfuscation-add-self-close',
        encoding: 'none'
      });
    }
  }

  return mutations;
}

/**
 * Deduplicate payloads
 * Removes duplicate mutations
 */
export function deduplicatePayloads(mutations) {
  const seen = new Set();
  return mutations.filter(mutation => {
    if (seen.has(mutation.payload)) {
      return false;
    }
    seen.add(mutation.payload);
    return true;
  });
}

/**
 * Test payloads against filter
 * Returns test results for each payload
 */
export function testAgainstFilter(mutations, filterPattern) {
  if (!filterPattern || !filterPattern.trim()) {
    return null;
  }

  return mutations.map(mutation => {
    try {
      // Try as regex pattern
      const regex = new RegExp(filterPattern, 'i');
      const blocked = regex.test(mutation.payload);

      return {
        payload: mutation.payload,
        strategy: mutation.strategy,
        blocked: blocked,
        reason: blocked ? 'Matched filter pattern' : 'Bypassed filter'
      };
    } catch (error) {
      // Treat as literal string match if regex is invalid
      const blocked = mutation.payload.toLowerCase()
        .includes(filterPattern.toLowerCase());

      return {
        payload: mutation.payload,
        strategy: mutation.strategy,
        blocked: blocked,
        reason: blocked ? 'Matched filter string' : 'Bypassed filter'
      };
    }
  });
}

/**
 * Generate all mutations for a base payload
 * Main entry point for payload fuzzing
 */
export function generateMutations(basePayload, strategies) {
  if (!basePayload || !basePayload.trim()) {
    return { mutations: [], total: 0, strategies: [] };
  }

  const mutations = [];

  // Always include the original payload
  mutations.push({
    payload: basePayload,
    strategy: 'original',
    encoding: 'none'
  });

  // Apply selected mutation strategies
  if (strategies.htmlEntities) {
    mutations.push(...htmlEntityEncode(basePayload, 'decimal'));
    mutations.push(...htmlEntityEncode(basePayload, 'hex'));
  }

  if (strategies.urlEncoding) {
    mutations.push(...urlEncode(basePayload, false));
    mutations.push(...urlEncode(basePayload, true));
  }

  if (strategies.unicodeEscapes) {
    mutations.push(...unicodeEncode(basePayload));
  }

  if (strategies.base64) {
    mutations.push(...base64Encode(basePayload));
  }

  if (strategies.caseVariations) {
    mutations.push(...caseVariation(basePayload));
  }

  if (strategies.quoteSubstitution) {
    mutations.push(...quoteSubstitution(basePayload));
  }

  if (strategies.whitespaceVariation) {
    mutations.push(...whitespaceVariation(basePayload));
  }

  if (strategies.nullBytes) {
    mutations.push(...nullByteInjection(basePayload));
  }

  if (strategies.comments) {
    mutations.push(...commentInsertion(basePayload));
  }

  if (strategies.protocolVariation) {
    mutations.push(...protocolVariation(basePayload));
  }

  if (strategies.obfuscation) {
    mutations.push(...obfuscate(basePayload));
  }

  // Deduplicate
  const unique = deduplicatePayloads(mutations);

  // Get list of active strategies
  const activeStrategies = Object.keys(strategies).filter(k => strategies[k]);

  return {
    mutations: unique,
    total: unique.length,
    strategies: activeStrategies
  };
}

/**
 * Format strategy name for display
 */
export function formatStrategyName(strategyKey) {
  const names = {
    htmlEntities: 'HTML Entities',
    urlEncoding: 'URL Encoding',
    unicodeEscapes: 'Unicode Escapes',
    base64: 'Base64 Encoding',
    caseVariations: 'Case Variations',
    quoteSubstitution: 'Quote Substitution',
    whitespaceVariation: 'Whitespace Variations',
    nullBytes: 'Null Byte Injection',
    comments: 'Comment Insertion',
    protocolVariation: 'Protocol Variations',
    obfuscation: 'Obfuscation'
  };

  return names[strategyKey] || strategyKey;
}
