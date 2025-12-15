/**
 * Cloudflare Pages Function: Hello World Test
 * Simple endpoint to verify Pages Functions are working
 *
 * Endpoint: GET /api/hello
 */

export async function onRequestGet(context) {
  return new Response(JSON.stringify({
    message: 'Hello from Cloudflare Pages Functions!',
    timestamp: new Date().toISOString(),
    requestUrl: context.request.url,
    method: context.request.method,
    headers: Object.fromEntries(context.request.headers)
  }, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  });
}
