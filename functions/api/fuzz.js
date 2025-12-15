/**
 * Cloudflare Pages Function: Payload Fuzzer
 *
 * Generates XSS payload mutations using various encoding and obfuscation techniques.
 *
 * Endpoints:
 * - POST /api/fuzz - Generate mutations from JSON payload
 * - GET /api/fuzz - Generate mutations from query parameters (testing)
 *
 * POST Request Body:
 * {
 *   "payload": "<script>alert(1)</script>",
 *   "strategies": ["htmlEntities", "urlEncoding", "caseVariations"],
 *   "limit": 10
 * }
 *
 * GET Query Parameters:
 * - payload: Base payload to mutate (required)
 * - strategies: Comma-separated list of strategies (optional)
 * - limit: Maximum number of mutations to return (optional, default: 1, max: 500)
 *
 * Available Strategies:
 * - htmlEntities: HTML entity encoding
 * - urlEncoding: URL percent encoding
 * - unicodeEscapes: Unicode escape sequences
 * - base64: Base64 encoding
 * - caseVariations: Case permutations
 * - quoteSubstitution: Quote type variations
 * - whitespaceVariation: Whitespace manipulation
 * - nullBytes: Null byte injection
 * - comments: HTML/JavaScript comment insertion
 * - protocolVariation: Protocol mutation
 * - obfuscation: Advanced obfuscation
 *
 * Example POST:
 * curl -X POST https://xss.page/api/fuzz \
 *   -H "Content-Type: application/json" \
 *   -d '{"payload":"<script>alert(1)</script>","strategies":["htmlEntities","urlEncoding"],"limit":10}'
 *
 * Example GET:
 * curl "https://xss.page/api/fuzz?payload=<script>alert(1)</script>&strategies=htmlEntities,urlEncoding&limit=5"
 */

import { generateMutations } from '../../utils/payload-fuzzer.mjs';

// Valid mutation strategies
const VALID_STRATEGIES = [
  'htmlEntities',
  'urlEncoding',
  'unicodeEscapes',
  'base64',
  'caseVariations',
  'quoteSubstitution',
  'whitespaceVariation',
  'nullBytes',
  'comments',
  'protocolVariation',
  'obfuscation'
];

/**
 * Parse strategies from various input formats
 * @param {string|array} strategies - Strategies as array or comma-separated string
 * @returns {object} Strategy object with boolean flags
 */
function parseStrategies(strategies) {
  const strategyObj = {};

  // If no strategies provided, enable all by default
  if (!strategies) {
    VALID_STRATEGIES.forEach(s => {
      strategyObj[s] = true;
    });
    return strategyObj;
  }

  // Convert to array if comma-separated string
  const strategyList = Array.isArray(strategies)
    ? strategies
    : strategies.split(',').map(s => s.trim());

  // Build strategy object
  VALID_STRATEGIES.forEach(s => {
    strategyObj[s] = strategyList.includes(s);
  });

  return strategyObj;
}

/**
 * Handle POST requests with JSON body
 */
export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { payload, strategies, limit } = body;

    // Validate payload
    if (!payload || typeof payload !== 'string') {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Payload is required and must be a string'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate payload length (max 5KB)
    if (payload.length > 5000) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Payload too large (max 5000 characters)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate limit (default: 1, min: 1, max: 500)
    let resultLimit = parseInt(limit, 10);
    if (isNaN(resultLimit) || resultLimit < 1) {
      resultLimit = 1; // Default
    }
    if (resultLimit > 500) {
      resultLimit = 500; // Maximum
    }

    // Parse and validate strategies
    const strategyObj = parseStrategies(strategies);

    // Generate mutations
    const results = generateMutations(payload, strategyObj);

    // Apply limit to mutations
    const limitedMutations = results.mutations.slice(0, resultLimit);

    // Build response with limit information
    const response = {
      basePayload: payload,
      strategies: results.strategies,
      total: results.total,
      returned: limitedMutations.length,
      limit: resultLimit,
      mutations: limitedMutations
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // 1 min cache
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Handle GET requests with query parameters (for testing)
 */
export async function onRequestGet(context) {
  try {
    const { searchParams } = new URL(context.request.url);

    // Get payload from query parameter
    const payload = searchParams.get('payload');

    // Validate payload
    if (!payload) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Payload query parameter is required',
        example: '/api/fuzz?payload=<script>alert(1)</script>&strategies=htmlEntities,urlEncoding&limit=10'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate payload length (max 5KB)
    if (payload.length > 5000) {
      return new Response(JSON.stringify({
        error: 'Bad Request',
        message: 'Payload too large (max 5000 characters)'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate limit (default: 1, min: 1, max: 500)
    const limitParam = searchParams.get('limit');
    let resultLimit = parseInt(limitParam, 10);
    if (isNaN(resultLimit) || resultLimit < 1) {
      resultLimit = 1; // Default
    }
    if (resultLimit > 500) {
      resultLimit = 500; // Maximum
    }

    // Get strategies from query parameter
    const strategiesParam = searchParams.get('strategies');
    const strategyObj = parseStrategies(strategiesParam);

    // Generate mutations
    const results = generateMutations(payload, strategyObj);

    // Apply limit to mutations
    const limitedMutations = results.mutations.slice(0, resultLimit);

    // Build response with limit information
    const response = {
      basePayload: payload,
      strategies: results.strategies,
      total: results.total,
      returned: limitedMutations.length,
      limit: resultLimit,
      mutations: limitedMutations
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60', // 1 min cache
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal Server Error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
