// DOM XSS Patterns Database
// Dangerous sinks, untrusted sources, and safe alternatives

export const dangerousSinks = {
  // Direct HTML manipulation
  'innerHTML': {
    name: 'innerHTML',
    type: 'property',
    severity: 'critical',
    description: 'Parses and renders HTML, allowing script execution',
    example: 'element.innerHTML = userInput;',
    safeAlternative: 'textContent',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'outerHTML': {
    name: 'outerHTML',
    type: 'property',
    severity: 'critical',
    description: 'Replaces element with parsed HTML',
    example: 'element.outerHTML = userInput;',
    safeAlternative: 'textContent',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'insertAdjacentHTML': {
    name: 'insertAdjacentHTML',
    type: 'method',
    severity: 'critical',
    description: 'Inserts HTML at specified position',
    example: 'element.insertAdjacentHTML("beforeend", userInput);',
    safeAlternative: 'insertAdjacentText or createElement',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'document.write': {
    name: 'document.write',
    type: 'method',
    severity: 'critical',
    description: 'Writes HTML directly to document stream',
    example: 'document.write(userInput);',
    safeAlternative: 'DOM manipulation methods',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'document.writeln': {
    name: 'document.writeln',
    type: 'method',
    severity: 'critical',
    description: 'Writes HTML with newline to document stream',
    example: 'document.writeln(userInput);',
    safeAlternative: 'DOM manipulation methods',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },

  // JavaScript execution
  'eval': {
    name: 'eval',
    type: 'function',
    severity: 'critical',
    description: 'Executes arbitrary JavaScript code',
    example: 'eval(userInput);',
    safeAlternative: 'JSON.parse for data, avoid for code',
    framework: 'vanilla',
    cwe: 'CWE-95'
  },
  'Function': {
    name: 'Function',
    type: 'constructor',
    severity: 'critical',
    description: 'Creates function from string, executes code',
    example: 'new Function(userInput)();',
    safeAlternative: 'Predefined functions',
    framework: 'vanilla',
    cwe: 'CWE-95'
  },
  'setTimeout': {
    name: 'setTimeout',
    type: 'function',
    severity: 'high',
    description: 'Executes code when first argument is string',
    example: 'setTimeout(userInput, 1000);',
    safeAlternative: 'setTimeout with function reference',
    framework: 'vanilla',
    cwe: 'CWE-95'
  },
  'setInterval': {
    name: 'setInterval',
    type: 'function',
    severity: 'high',
    description: 'Executes code repeatedly when first argument is string',
    example: 'setInterval(userInput, 1000);',
    safeAlternative: 'setInterval with function reference',
    framework: 'vanilla',
    cwe: 'CWE-95'
  },
  'setImmediate': {
    name: 'setImmediate',
    type: 'function',
    severity: 'high',
    description: 'Executes code when argument is string',
    example: 'setImmediate(userInput);',
    safeAlternative: 'setImmediate with function reference',
    framework: 'vanilla',
    cwe: 'CWE-95'
  },

  // Dynamic script loading
  'script.src': {
    name: 'script.src',
    type: 'property',
    severity: 'critical',
    description: 'Loads and executes external script',
    example: 'script.src = userInput;',
    safeAlternative: 'Whitelist allowed script sources',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'script.text': {
    name: 'script.text',
    type: 'property',
    severity: 'critical',
    description: 'Sets script content to be executed',
    example: 'script.text = userInput;',
    safeAlternative: 'Avoid dynamic script generation',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'script.textContent': {
    name: 'script.textContent',
    type: 'property',
    severity: 'critical',
    description: 'Sets script content to be executed',
    example: 'script.textContent = userInput;',
    safeAlternative: 'Avoid dynamic script generation',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },

  // Event handlers
  'element.onclick': {
    name: 'element.on*',
    type: 'property',
    severity: 'high',
    description: 'Sets event handler from string',
    example: 'element.onclick = userInput;',
    safeAlternative: 'addEventListener with function',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'setAttribute': {
    name: 'setAttribute',
    type: 'method',
    severity: 'high',
    description: 'Can set dangerous attributes like onclick, onerror',
    example: 'element.setAttribute("onclick", userInput);',
    safeAlternative: 'addEventListener for events, direct property for safe attributes',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },

  // Location manipulation
  'location': {
    name: 'location',
    type: 'property',
    severity: 'high',
    description: 'Navigates to URL, javascript: URLs execute code',
    example: 'location = userInput;',
    safeAlternative: 'Validate URL, use location.href with checks',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'location.href': {
    name: 'location.href',
    type: 'property',
    severity: 'high',
    description: 'Navigates to URL, javascript: URLs execute code',
    example: 'location.href = userInput;',
    safeAlternative: 'Validate URL protocol',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'location.assign': {
    name: 'location.assign',
    type: 'method',
    severity: 'high',
    description: 'Navigates to URL, javascript: URLs execute code',
    example: 'location.assign(userInput);',
    safeAlternative: 'Validate URL protocol',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },
  'location.replace': {
    name: 'location.replace',
    type: 'method',
    severity: 'high',
    description: 'Navigates to URL, javascript: URLs execute code',
    example: 'location.replace(userInput);',
    safeAlternative: 'Validate URL protocol',
    framework: 'vanilla',
    cwe: 'CWE-79'
  },

  // React-specific
  'dangerouslySetInnerHTML': {
    name: 'dangerouslySetInnerHTML',
    type: 'prop',
    severity: 'critical',
    description: 'React prop that bypasses XSS protection',
    example: '<div dangerouslySetInnerHTML={{__html: userInput}} />',
    safeAlternative: 'Use children or textContent, sanitize with DOMPurify if needed',
    framework: 'react',
    cwe: 'CWE-79'
  },

  // Vue-specific
  'v-html': {
    name: 'v-html',
    type: 'directive',
    severity: 'critical',
    description: 'Vue directive that renders raw HTML',
    example: '<div v-html="userInput"></div>',
    safeAlternative: 'Use text interpolation {{ }}, sanitize with DOMPurify if needed',
    framework: 'vue',
    cwe: 'CWE-79'
  },

  // Angular-specific
  '[innerHTML]': {
    name: '[innerHTML]',
    type: 'binding',
    severity: 'high',
    description: 'Angular property binding for HTML content',
    example: '<div [innerHTML]="userInput"></div>',
    safeAlternative: 'Use text interpolation, sanitize with DomSanitizer',
    framework: 'angular',
    cwe: 'CWE-79'
  },
  'bypassSecurityTrustHtml': {
    name: 'bypassSecurityTrustHtml',
    type: 'method',
    severity: 'critical',
    description: 'Angular method that bypasses sanitization',
    example: 'this.sanitizer.bypassSecurityTrustHtml(userInput)',
    safeAlternative: 'Avoid bypassing, use Angular sanitization',
    framework: 'angular',
    cwe: 'CWE-79'
  },
  'bypassSecurityTrustScript': {
    name: 'bypassSecurityTrustScript',
    type: 'method',
    severity: 'critical',
    description: 'Angular method that bypasses script sanitization',
    example: 'this.sanitizer.bypassSecurityTrustScript(userInput)',
    safeAlternative: 'Avoid bypassing security',
    framework: 'angular',
    cwe: 'CWE-95'
  },
  'bypassSecurityTrustUrl': {
    name: 'bypassSecurityTrustUrl',
    type: 'method',
    severity: 'high',
    description: 'Angular method that bypasses URL sanitization',
    example: 'this.sanitizer.bypassSecurityTrustUrl(userInput)',
    safeAlternative: 'Validate URLs instead of bypassing',
    framework: 'angular',
    cwe: 'CWE-79'
  },

  // jQuery (legacy but still common)
  '$.html': {
    name: '$.html()',
    type: 'method',
    severity: 'critical',
    description: 'jQuery method that sets HTML content',
    example: '$("div").html(userInput);',
    safeAlternative: '$.text() for text content',
    framework: 'jquery',
    cwe: 'CWE-79'
  },
  '$.append': {
    name: '$.append()',
    type: 'method',
    severity: 'high',
    description: 'jQuery method that can append HTML',
    example: '$("div").append(userInput);',
    safeAlternative: 'Create elements with $.text() or escape content',
    framework: 'jquery',
    cwe: 'CWE-79'
  }
};

export const untrustedSources = {
  // URL-based sources
  'location.hash': {
    name: 'location.hash',
    type: 'property',
    severity: 'high',
    description: 'URL fragment, user-controllable',
    example: 'const data = location.hash;',
    validation: 'Sanitize, validate format'
  },
  'location.search': {
    name: 'location.search',
    type: 'property',
    severity: 'high',
    description: 'URL query string, user-controllable',
    example: 'const data = location.search;',
    validation: 'Parse and validate parameters'
  },
  'location.pathname': {
    name: 'location.pathname',
    type: 'property',
    severity: 'medium',
    description: 'URL path, potentially user-controllable',
    example: 'const data = location.pathname;',
    validation: 'Validate against allowed paths'
  },
  'location.href': {
    name: 'location.href',
    type: 'property',
    severity: 'high',
    description: 'Full URL, user-controllable',
    example: 'const data = location.href;',
    validation: 'Parse and validate components'
  },
  'window.name': {
    name: 'window.name',
    type: 'property',
    severity: 'high',
    description: 'Window name, persists across pages, user-controllable',
    example: 'const data = window.name;',
    validation: 'Treat as untrusted user input'
  },

  // Document sources
  'document.referrer': {
    name: 'document.referrer',
    type: 'property',
    severity: 'medium',
    description: 'Referrer URL, user-controllable',
    example: 'const data = document.referrer;',
    validation: 'Validate origin and format'
  },
  'document.cookie': {
    name: 'document.cookie',
    type: 'property',
    severity: 'medium',
    description: 'Cookies, potentially user-controllable',
    example: 'const data = document.cookie;',
    validation: 'Parse and validate cookie values'
  },
  'document.URL': {
    name: 'document.URL',
    type: 'property',
    severity: 'high',
    description: 'Current document URL, user-controllable',
    example: 'const data = document.URL;',
    validation: 'Parse and validate components'
  },
  'document.documentURI': {
    name: 'document.documentURI',
    type: 'property',
    severity: 'high',
    description: 'Document URI, user-controllable',
    example: 'const data = document.documentURI;',
    validation: 'Parse and validate components'
  },
  'document.baseURI': {
    name: 'document.baseURI',
    type: 'property',
    severity: 'medium',
    description: 'Base URI of document',
    example: 'const data = document.baseURI;',
    validation: 'Validate if used in sensitive contexts'
  },

  // Message events
  'postMessage': {
    name: 'postMessage event data',
    type: 'event',
    severity: 'high',
    description: 'Cross-origin message data, untrusted',
    example: 'window.addEventListener("message", e => { data = e.data; });',
    validation: 'Validate origin, sanitize data'
  },

  // Storage
  'localStorage': {
    name: 'localStorage',
    type: 'api',
    severity: 'medium',
    description: 'Local storage, can contain user input or be manipulated',
    example: 'const data = localStorage.getItem("key");',
    validation: 'Validate and sanitize stored data'
  },
  'sessionStorage': {
    name: 'sessionStorage',
    type: 'api',
    severity: 'medium',
    description: 'Session storage, can contain user input',
    example: 'const data = sessionStorage.getItem("key");',
    validation: 'Validate and sanitize stored data'
  },

  // IndexedDB
  'indexedDB': {
    name: 'indexedDB',
    type: 'api',
    severity: 'medium',
    description: 'IndexedDB data, can be manipulated',
    example: 'const data = await db.get("key");',
    validation: 'Validate and sanitize retrieved data'
  },

  // Web APIs
  'WebSocket': {
    name: 'WebSocket messages',
    type: 'api',
    severity: 'high',
    description: 'WebSocket message data, potentially untrusted',
    example: 'ws.onmessage = e => { data = e.data; };',
    validation: 'Validate message origin and content'
  },
  'fetch': {
    name: 'fetch response',
    type: 'api',
    severity: 'medium',
    description: 'HTTP response data, validate even if from your API',
    example: 'const data = await fetch(url).then(r => r.text());',
    validation: 'Validate and sanitize response data'
  },
  'XMLHttpRequest': {
    name: 'XMLHttpRequest response',
    type: 'api',
    severity: 'medium',
    description: 'HTTP response data',
    example: 'const data = xhr.responseText;',
    validation: 'Validate and sanitize response data'
  }
};

export const safeAlternatives = {
  'innerHTML': [
    {
      name: 'textContent',
      description: 'Sets text content without parsing HTML',
      example: 'element.textContent = userInput;',
      when: 'When displaying plain text'
    },
    {
      name: 'createElement + textContent',
      description: 'Create elements programmatically with safe text',
      example: 'const p = document.createElement("p"); p.textContent = userInput; parent.appendChild(p);',
      when: 'When building DOM structures'
    },
    {
      name: 'DOMPurify.sanitize',
      description: 'Sanitize HTML with DOMPurify library',
      example: 'element.innerHTML = DOMPurify.sanitize(userInput);',
      when: 'When you must render user HTML'
    }
  ],
  'eval': [
    {
      name: 'JSON.parse',
      description: 'Parse JSON data safely',
      example: 'const data = JSON.parse(userInput);',
      when: 'When parsing JSON data'
    },
    {
      name: 'Predefined functions',
      description: 'Use predefined function references',
      example: 'const fn = functionMap[userInput]; if (fn) fn();',
      when: 'When selecting from known operations'
    }
  ],
  'dangerouslySetInnerHTML': [
    {
      name: 'Children',
      description: 'Use React children for content',
      example: '<div>{userInput}</div>',
      when: 'When displaying text or React elements'
    },
    {
      name: 'DOMPurify + dangerouslySetInnerHTML',
      description: 'Sanitize HTML before rendering',
      example: '<div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(userInput)}} />',
      when: 'When you must render user HTML'
    }
  ],
  'v-html': [
    {
      name: 'Text interpolation',
      description: 'Use Vue text interpolation',
      example: '<div>{{ userInput }}</div>',
      when: 'When displaying text content'
    },
    {
      name: 'DOMPurify + v-html',
      description: 'Sanitize HTML before rendering',
      example: '<div v-html="sanitize(userInput)"></div>',
      when: 'When you must render user HTML'
    }
  ],
  'location.href': [
    {
      name: 'URL validation',
      description: 'Validate URL before navigation',
      example: 'if (url.startsWith("https://trusted.com")) location.href = url;',
      when: 'When navigating based on user input'
    },
    {
      name: 'Whitelist check',
      description: 'Check against allowed URLs',
      example: 'const allowed = ["https://app.com/page1", "https://app.com/page2"]; if (allowed.includes(url)) location.href = url;',
      when: 'When you have a fixed set of destinations'
    }
  ]
};

export const validationPatterns = [
  {
    name: 'URL Protocol Validation',
    pattern: /^(https?|ftp):\/\//i,
    description: 'Ensure URL uses safe protocols',
    example: 'if (!/^https?:\\/\\//.test(url)) throw new Error("Invalid protocol");'
  },
  {
    name: 'HTML Entity Encoding',
    description: 'Encode HTML special characters',
    example: 'const escaped = text.replace(/[&<>"\']/g, c => entityMap[c]);'
  },
  {
    name: 'Attribute Value Encoding',
    description: 'Encode for use in HTML attributes',
    example: 'const encoded = value.replace(/["\']/g, c => `&#${c.charCodeAt(0)};`);'
  },
  {
    name: 'JavaScript String Escaping',
    description: 'Escape for use in JavaScript strings',
    example: 'const escaped = str.replace(/[\\\\"\'\\n\\r]/g, c => `\\\\${c}`);'
  },
  {
    name: 'URL Encoding',
    description: 'Encode for use in URLs',
    example: 'const encoded = encodeURIComponent(userInput);'
  }
];

export const frameworks = {
  react: {
    name: 'React',
    safePractices: [
      'Use JSX text interpolation {userInput} for text',
      'React auto-escapes text content',
      'Avoid dangerouslySetInnerHTML unless absolutely necessary',
      'Use DOMPurify if you must render user HTML',
      'Validate URLs before using in href or src'
    ],
    dangerousPatterns: ['dangerouslySetInnerHTML']
  },
  vue: {
    name: 'Vue',
    safePractices: [
      'Use text interpolation {{ userInput }} for text',
      'Vue auto-escapes text content',
      'Avoid v-html unless absolutely necessary',
      'Use DOMPurify if you must render user HTML',
      'Validate URLs before using in v-bind:href'
    ],
    dangerousPatterns: ['v-html']
  },
  angular: {
    name: 'Angular',
    safePractices: [
      'Use text interpolation {{ userInput }} for text',
      'Angular auto-sanitizes by default',
      'Avoid bypassSecurityTrust* methods',
      'Use DomSanitizer only when necessary',
      'Trust Angular sanitization for most cases'
    ],
    dangerousPatterns: ['[innerHTML]', 'bypassSecurityTrustHtml', 'bypassSecurityTrustScript']
  },
  vanilla: {
    name: 'Vanilla JavaScript',
    safePractices: [
      'Use textContent for text, not innerHTML',
      'Create elements with createElement',
      'Use addEventListener for events, not inline handlers',
      'Validate and sanitize all user input',
      'Use DOMPurify for any HTML rendering'
    ],
    dangerousPatterns: ['innerHTML', 'outerHTML', 'eval', 'document.write']
  }
};

export const commonVulnerabilityPatterns = [
  {
    name: 'URL Fragment XSS',
    source: 'location.hash',
    sink: 'innerHTML',
    example: 'document.getElementById("content").innerHTML = location.hash.substring(1);',
    severity: 'critical',
    fix: 'Use textContent or sanitize with DOMPurify'
  },
  {
    name: 'Query Parameter XSS',
    source: 'location.search',
    sink: 'innerHTML',
    example: 'const params = new URLSearchParams(location.search); div.innerHTML = params.get("name");',
    severity: 'critical',
    fix: 'Use textContent or sanitize'
  },
  {
    name: 'postMessage XSS',
    source: 'postMessage event',
    sink: 'innerHTML',
    example: 'window.addEventListener("message", e => { div.innerHTML = e.data; });',
    severity: 'critical',
    fix: 'Validate origin, sanitize data, use textContent'
  },
  {
    name: 'localStorage XSS',
    source: 'localStorage',
    sink: 'innerHTML',
    example: 'div.innerHTML = localStorage.getItem("username");',
    severity: 'high',
    fix: 'Validate and sanitize stored data before rendering'
  },
  {
    name: 'Eval with URL',
    source: 'location.search',
    sink: 'eval',
    example: 'eval(new URLSearchParams(location.search).get("code"));',
    severity: 'critical',
    fix: 'Never use eval with user input, use safer alternatives'
  },
  {
    name: 'JavaScript URL Navigation',
    source: 'location.hash',
    sink: 'location.href',
    example: 'location.href = location.hash.substring(1);',
    severity: 'high',
    fix: 'Validate URL protocol to prevent javascript: URLs'
  }
];
