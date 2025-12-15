# Cloudflare Pages Functions

This directory contains serverless functions that run on Cloudflare's edge network using Pages Functions (Cloudflare Workers).

## Directory Structure

```
functions/
└── api/
    ├── _middleware.js    # CORS handling for all /api/* endpoints
    ├── hello.js          # Test endpoint
    └── search.js         # Dynamic payload search
```

## Available Endpoints

### Test Endpoint

**GET** `/api/hello`

Simple test endpoint to verify Pages Functions are working.

**Response:**
```json
{
  "message": "Hello from Cloudflare Pages Functions!",
  "timestamp": "2025-12-15T...",
  "requestUrl": "https://xss.page/api/hello",
  "method": "GET"
}
```

### Search Payloads

**GET** `/api/search`

Dynamic search endpoint for filtering XSS payloads.

**Query Parameters:**
- `q` - Search query (matches payload, description, technique, category)
- `category` - Filter by category (e.g., "basic", "event-handler")
- `severity` - Filter by severity ("critical", "high", "medium", "low")
- `context` - Filter by context ("html", "javascript", "url", etc.)
- `browser` - Filter by browser compatibility
- `limit` - Maximum results (default: 100, max: 500)

**Examples:**

```bash
# Search for "script" payloads
curl "https://xss.page/api/search?q=script"

# Filter by category and severity
curl "https://xss.page/api/search?category=basic&severity=high"

# Search with limit
curl "https://xss.page/api/search?q=alert&limit=20"

# Complex query
curl "https://xss.page/api/search?q=onerror&context=html&browser=chrome&limit=50"
```

**Response:**
```json
{
  "query": "script",
  "filters": {
    "category": "basic",
    "severity": "high",
    "context": null,
    "browser": null
  },
  "count": 45,
  "returned": 45,
  "payloads": [
    {
      "id": 1,
      "payload": "<script>alert(1)</script>",
      "category": "basic",
      "technique": "script-tag",
      "context": "html",
      "description": "Classic XSS payload using script tag",
      "severity": "high",
      "browsers": ["all"]
    }
  ]
}
```

## How It Works

### Cloudflare Pages Functions

- Functions are deployed automatically when you push to GitHub
- They run on Cloudflare's global edge network (same as Workers)
- No configuration needed - Cloudflare auto-detects the `/functions/` directory
- Works alongside static files (hybrid static + dynamic)

### File-based Routing

- `/functions/api/hello.js` → `GET /api/hello`
- `/functions/api/search.js` → `GET /api/search`
- `/functions/api/_middleware.js` → Runs before all `/api/*` requests

### Runtime Environment

- **V8 Isolates** (not Node.js containers) - zero cold starts
- **Web APIs** (not full Node.js APIs)
- **10ms CPU limit** on free tier
- **1MB request/response** size limit
- Import ES modules from `/data/` and `/utils/` directories

## Development

### Local Testing

Cloudflare Pages Functions cannot be tested locally using `next dev`. They only run when deployed to Cloudflare Pages.

To test:
1. Commit and push changes
2. Cloudflare Pages automatically deploys
3. Test at `https://xss.page/api/search`

### CORS

All endpoints have CORS enabled via `_middleware.js`:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`

### Caching

Search endpoint caching:
- Browser cache: 5 minutes (`max-age=300`)
- CDN cache: 10 minutes (`s-maxage=600`)

## Adding New Endpoints

Create a new file in `/functions/api/`:

```javascript
// /functions/api/your-endpoint.js
export async function onRequestGet(context) {
  const { request, env, params } = context;

  // Your logic here
  const data = { message: "Hello!" };

  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60'
    }
  });
}
```

Available methods:
- `onRequestGet` - GET requests
- `onRequestPost` - POST requests
- `onRequestPut` - PUT requests
- `onRequestDelete` - DELETE requests
- `onRequest` - All methods

## Compatibility Notes

### ✅ Compatible

- ES modules (`import`/`export`)
- Standard JavaScript
- `fetch()` API
- `URL`, `URLSearchParams`
- `Headers`, `Request`, `Response`
- `TextEncoder`, `TextDecoder`
- `crypto.subtle`

### ❌ Not Compatible

- `Buffer` - Use `TextEncoder`/`btoa()` instead
- `fs`, `path` - No file system access
- `process.env` - Use `context.env` instead
- `setTimeout`/`setInterval` - Use Durable Objects for state

## Resources

- [Cloudflare Pages Functions Docs](https://developers.cloudflare.com/pages/functions/)
- [Workers Runtime APIs](https://developers.cloudflare.com/workers/runtime-apis/)
- [Request Context](https://developers.cloudflare.com/pages/functions/api-reference/#eventcontext)

## Free Tier Limits

- **Requests:** 100,000 per day
- **Duration:** 10ms CPU time per invocation
- **Memory:** 128 MB
- **Request Size:** 1 MB
- **Response Size:** 1 MB

Paid tier: $5/month for 10M requests
