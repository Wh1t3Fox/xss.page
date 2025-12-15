/**
 * Cloudflare Pages Function: Dynamic Payload Search
 *
 * Endpoint: GET /api/search
 *
 * Query Parameters:
 * - q: Search query (matches payload, description, technique)
 * - category: Filter by category (e.g., "basic", "event-handler")
 * - severity: Filter by severity (e.g., "critical", "high", "medium", "low")
 * - context: Filter by context (e.g., "html", "javascript", "url")
 * - browser: Filter by browser compatibility
 * - limit: Maximum number of results (default: 100)
 *
 * Example: /api/search?q=script&category=basic&severity=high&limit=50
 */

import { payloads } from '../../data/payloads.mjs';

export async function onRequestGet(context) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(context.request.url);

    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const contextFilter = searchParams.get('context');
    const browser = searchParams.get('browser');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let results = payloads;

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(p =>
        p.payload.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.technique.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (category) {
      results = results.filter(p => p.category === category);
    }

    // Filter by severity
    if (severity) {
      results = results.filter(p => p.severity === severity);
    }

    // Filter by context
    if (contextFilter) {
      results = results.filter(p => p.context === contextFilter);
    }

    // Filter by browser compatibility
    if (browser) {
      results = results.filter(p =>
        p.browsers.includes(browser) ||
        p.browsers.includes('all')
      );
    }

    // Apply limit
    const limitedResults = results.slice(0, Math.min(limit, 500)); // Max 500 results

    // Build response
    const response = {
      query,
      filters: {
        category: category || null,
        severity: severity || null,
        context: contextFilter || null,
        browser: browser || null
      },
      count: results.length,
      returned: limitedResults.length,
      payloads: limitedResults
    };

    return new Response(JSON.stringify(response, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min browser, 10 min CDN
      }
    });

  } catch (error) {
    // Error handling
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}
