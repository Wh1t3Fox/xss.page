/**
 * Cloudflare Pages Function: Payload Fuzzer
 *
 * Dual-mode XSS payload generation and mutation tool.
 *
 * ==================================================================
 * MODE 1: MUTATION MODE (payload provided)
 * ==================================================================
 * Generates XSS payload mutations using various encoding and obfuscation techniques.
 * IMPORTANT: The original payload is NOT included in the mutations array.
 * Only mutated variations are returned. The original is available in the basePayload field.
 *
 * POST Request Body:
 * {
 *   "payload": "<script>alert(1)</script>",
 *   "strategies": ["htmlEntities", "urlEncoding"],
 *   "limit": 10
 * }
 *
 * GET Query Parameters:
 * - payload: Base payload to mutate (required for mutation mode)
 * - strategies: Comma-separated list of strategies (optional)
 * - limit: Maximum number of mutations to return (optional, default: 1, max: 500)
 *
 * Example:
 * curl -X POST https://xss.page/api/fuzz \
 *   -H "Content-Type: application/json" \
 *   -d '{"payload":"<script>alert(1)</script>","strategies":["htmlEntities"],"limit":5}'
 *
 * ==================================================================
 * MODE 2: GENERATION MODE (no payload provided)
 * ==================================================================
 * Generates arbitrary XSS payloads using template-based randomization.
 * Returns N random XSS payloads with optional mutation strategies applied.
 *
 * POST Request Body:
 * {
 *   "strategies": ["htmlEntities", "urlEncoding"],  // optional
 *   "limit": 20
 * }
 *
 * GET Query Parameters:
 * - limit: Number of payloads to generate (optional, default: 10, max: 500)
 * - strategies: Comma-separated mutation strategies to apply (optional)
 *
 * Example:
 * curl -X POST https://xss.page/api/fuzz \
 *   -H "Content-Type: application/json" \
 *   -d '{"limit":20}'
 *
 * curl "https://xss.page/api/fuzz?limit=10&strategies=htmlEntities"
 *
 * ==================================================================
 *
 * Available Mutation Strategies:
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
 * Payload Generation Categories (weighted):
 * - Event Handlers (30%): <img onerror=...>, <svg onload=...>
 * - Script Tags (20%): <script>alert(1)</script>
 * - SVG-based (15%): <svg><script>...</script></svg>
 * - Protocol Handlers (15%): javascript:alert(1), data:text/html,...
 * - Iframe-based (10%): <iframe src=javascript:...>
 * - Attribute-based (5%): <a href=javascript:...>
 * - Encoded/Obfuscated (5%): Entity-encoded, base64, etc.
 */

import { generateMutations } from '../../utils/payload-fuzzer.mjs';
import { generateRandomPayloads, INJECTION_CONTEXTS } from '../../utils/payload-generator.mjs';

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
    const { payload, strategies, limit, context: injectionContext } = body;

    // Parse and validate limit
    let resultLimit = parseInt(limit, 10);
    if (isNaN(resultLimit) || resultLimit < 1) {
      resultLimit = payload ? 1 : 10; // Default: 1 for mutation mode, 10 for generation mode
    }
    if (resultLimit > 500) {
      resultLimit = 500; // Maximum
    }

    // MODE 1: Mutation Mode (payload provided)
    if (payload) {
      // Validate payload type
      if (typeof payload !== 'string') {
        return new Response(JSON.stringify({
          error: 'Bad Request',
          message: 'Payload must be a string'
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

      // Parse and validate strategies
      const strategyObj = parseStrategies(strategies);

      // Generate mutations
      const results = generateMutations(payload, strategyObj);

      // Filter out the original payload (strategy === 'original')
      const mutationsOnly = results.mutations.filter(m => m.strategy !== 'original');

      // Apply limit to mutations
      const limitedMutations = mutationsOnly.slice(0, resultLimit);

      // Build response with limit information
      const response = {
        mode: 'mutation',
        basePayload: payload,
        strategies: results.strategies,
        total: mutationsOnly.length,
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
    }

    // MODE 2: Generation Mode (no payload provided)
    else {
      // Validate context if provided
      const validContexts = Object.values(INJECTION_CONTEXTS);
      const selectedContext = (injectionContext && validContexts.includes(injectionContext))
        ? injectionContext
        : INJECTION_CONTEXTS.ANY;

      // Generate random payloads with context filtering
      const generatedPayloads = generateRandomPayloads(resultLimit, {
        context: selectedContext
      });

      // Optionally apply mutations if strategies are provided
      const strategyObj = parseStrategies(strategies);
      const hasStrategies = Object.values(strategyObj).some(v => v);

      let finalPayloads = generatedPayloads;

      if (hasStrategies) {
        // Apply mutations to each generated payload
        finalPayloads = [];
        for (const genPayload of generatedPayloads) {
          const results = generateMutations(genPayload.payload, strategyObj);
          const mutationsOnly = results.mutations.filter(m => m.strategy !== 'original');

          // Take first mutation for each generated payload
          if (mutationsOnly.length > 0) {
            finalPayloads.push({
              ...genPayload,
              payload: mutationsOnly[0].payload,
              mutationStrategy: mutationsOnly[0].strategy,
              mutated: true
            });
          } else {
            finalPayloads.push(genPayload);
          }
        }
      }

      // Build response
      const response = {
        mode: 'generation',
        context: selectedContext,
        total: finalPayloads.length,
        returned: finalPayloads.length,
        limit: resultLimit,
        mutationsApplied: hasStrategies,
        payloads: finalPayloads
      };

      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // 1 min cache
        }
      });
    }

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

    // Get parameters
    const payload = searchParams.get('payload');
    const limitParam = searchParams.get('limit');
    const strategiesParam = searchParams.get('strategies');
    const contextParam = searchParams.get('context');

    // Parse and validate limit
    let resultLimit = parseInt(limitParam, 10);
    if (isNaN(resultLimit) || resultLimit < 1) {
      resultLimit = payload ? 1 : 10; // Default: 1 for mutation mode, 10 for generation mode
    }
    if (resultLimit > 500) {
      resultLimit = 500; // Maximum
    }

    // MODE 1: Mutation Mode (payload provided)
    if (payload) {
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

      // Parse strategies
      const strategyObj = parseStrategies(strategiesParam);

      // Generate mutations
      const results = generateMutations(payload, strategyObj);

      // Filter out the original payload (strategy === 'original')
      const mutationsOnly = results.mutations.filter(m => m.strategy !== 'original');

      // Apply limit to mutations
      const limitedMutations = mutationsOnly.slice(0, resultLimit);

      // Build response
      const response = {
        mode: 'mutation',
        basePayload: payload,
        strategies: results.strategies,
        total: mutationsOnly.length,
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
    }

    // MODE 2: Generation Mode (no payload provided)
    else {
      // Validate context if provided
      const validContexts = Object.values(INJECTION_CONTEXTS);
      const selectedContext = (contextParam && validContexts.includes(contextParam))
        ? contextParam
        : INJECTION_CONTEXTS.ANY;

      // Generate random payloads with context filtering
      const generatedPayloads = generateRandomPayloads(resultLimit, {
        context: selectedContext
      });

      // Optionally apply mutations if strategies are provided
      const strategyObj = parseStrategies(strategiesParam);
      const hasStrategies = Object.values(strategyObj).some(v => v);

      let finalPayloads = generatedPayloads;

      if (hasStrategies) {
        // Apply mutations to each generated payload
        finalPayloads = [];
        for (const genPayload of generatedPayloads) {
          const results = generateMutations(genPayload.payload, strategyObj);
          const mutationsOnly = results.mutations.filter(m => m.strategy !== 'original');

          // Take first mutation for each generated payload
          if (mutationsOnly.length > 0) {
            finalPayloads.push({
              ...genPayload,
              payload: mutationsOnly[0].payload,
              mutationStrategy: mutationsOnly[0].strategy,
              mutated: true
            });
          } else {
            finalPayloads.push(genPayload);
          }
        }
      }

      // Build response
      const response = {
        mode: 'generation',
        context: selectedContext,
        total: finalPayloads.length,
        returned: finalPayloads.length,
        limit: resultLimit,
        mutationsApplied: hasStrategies,
        payloads: finalPayloads
      };

      return new Response(JSON.stringify(response, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60', // 1 min cache
        }
      });
    }

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
