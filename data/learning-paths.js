/**
 * Learning Paths - Structured curriculum for XSS education
 *
 * Defines learning paths, lessons, challenges, and quizzes for the
 * interactive learning platform.
 */

// Learning Path Definitions
export const learningPaths = {
  beginner: {
    id: 'beginner',
    title: 'XSS Fundamentals',
    description: 'Start your XSS security journey from the basics. Learn what Cross-Site Scripting is, how it works, and master fundamental attack vectors.',
    difficulty: 'beginner',
    estimatedHours: 4,
    prerequisites: [],
    icon: 'book-open',
    color: 'green',
    lessons: ['intro-to-xss', 'basic-payloads', 'html-context', 'filter-bypasses', 'detection-prevention']
  },

  offensive: {
    id: 'offensive',
    title: 'Offensive XSS Testing',
    description: 'Advanced exploitation and bypass techniques for penetration testing',
    difficulty: 'intermediate',
    estimatedHours: 12,
    prerequisites: ['beginner'],
    icon: 'shield-exclamation',
    color: 'red',
    lessons: []  // To be populated
  },

  defensive: {
    id: 'defensive',
    title: 'Defensive Strategies',
    description: 'Build secure applications and implement proper defenses against XSS',
    difficulty: 'intermediate',
    estimatedHours: 10,
    prerequisites: ['beginner'],
    icon: 'shield-check',
    color: 'blue',
    lessons: []  // To be populated
  },

  react: {
    id: 'react',
    title: 'React Security',
    description: 'XSS prevention in React applications',
    difficulty: 'intermediate',
    estimatedHours: 6,
    prerequisites: ['beginner'],
    icon: 'code',
    color: 'cyan',
    lessons: []  // To be populated
  },

  vue: {
    id: 'vue',
    title: 'Vue.js Security',
    description: 'Secure Vue.js development practices',
    difficulty: 'intermediate',
    estimatedHours: 6,
    prerequisites: ['beginner'],
    icon: 'code',
    color: 'emerald',
    lessons: []  // To be populated
  },

  advanced: {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Mutation XSS, CSP bypasses, and modern techniques',
    difficulty: 'advanced',
    estimatedHours: 15,
    prerequisites: ['offensive', 'defensive'],
    icon: 'fire',
    color: 'purple',
    lessons: []  // To be populated
  }
};

// Lesson Definitions
export const lessons = {
  'intro-to-xss': {
    id: 'intro-to-xss',
    title: 'Introduction to XSS',
    description: 'Understand what Cross-Site Scripting is and why it matters',
    path: 'beginner',
    order: 1,
    estimatedMinutes: 30,
    objectives: [
      'Define Cross-Site Scripting (XSS)',
      'Identify the three main types of XSS',
      'Understand the impact of XSS vulnerabilities',
      'Recognize basic XSS payloads'
    ],
    content: {
      theory: `# Introduction to Cross-Site Scripting (XSS)

## What is XSS?

Cross-Site Scripting (XSS) is a **security vulnerability** that allows attackers to inject malicious scripts into web pages viewed by other users. When a victim's browser executes the malicious script, the attacker can:

- **Steal session cookies** and hijack user accounts
- **Perform actions** on behalf of the victim
- **Deface websites** or redirect users to malicious sites
- **Log keystrokes** and capture sensitive data
- **Spread worms** that attack other users

## Why "Cross-Site"?

The term "Cross-Site" comes from the ability to execute scripts in the context of another site. An attacker can inject code that runs with the same privileges as the legitimate website, bypassing the browser's Same-Origin Policy.

> **Note:** XSS is abbreviated with an "X" instead of "C" to avoid confusion with Cascading Style Sheets (CSS).

## Three Types of XSS

### 1. Reflected XSS (Non-Persistent)

The malicious script is **reflected off a web server**, typically through a URL parameter or form input. The script is immediately returned in the server's response without being stored.

**Example:** A search feature that displays your query without encoding:
\`\`\`
https://example.com/search?q=<script>alert(1)</script>
\`\`\`

### 2. Stored XSS (Persistent)

The malicious script is **permanently stored** on the target server (in a database, comment field, forum post, etc.) and executed whenever users view the stored data.

**Example:** A comment system that doesn't sanitize input:
\`\`\`html
<!-- Attacker submits: -->
<script>alert(document.cookie)</script>

<!-- When other users view comments, the script executes -->
\`\`\`

### 3. DOM-based XSS

The vulnerability exists in **client-side JavaScript** that processes user-controlled data insecurely, without the server being involved.

**Example:** JavaScript that writes URL parameters directly to the page:
\`\`\`javascript
// Vulnerable code
var search = location.search.substring(1);
document.write(search);
\`\`\`

## Real-World Impact

XSS vulnerabilities have affected major platforms:

- **Twitter (2010)**: XSS worm that spread by retweeting itself
- **MySpace (2005)**: Samy worm infected over 1 million profiles
- **eBay (2014)**: Stored XSS allowing account takeover
- **British Airways (2018)**: XSS used to steal payment data

## Defense Preview

While this lesson focuses on understanding XSS attacks, defenses include:
- **Output encoding** (converting < > " ' & to HTML entities)
- **Content Security Policy (CSP)** headers
- **Input validation** and sanitization
- **HTTPOnly and Secure** cookie flags

We'll explore these defenses in detail in later lessons.`,

      examples: [
        {
          title: 'Basic Reflected XSS',
          code: '<script>alert(document.cookie)</script>',
          explanation: 'This payload executes JavaScript in the victim\'s browser, displaying their session cookies in an alert box. An attacker could replace alert() with code to send the cookies to their server.',
          vulnerable: true
        },
        {
          title: 'Image Tag with Event Handler',
          code: '<img src=x onerror=alert(1)>',
          explanation: 'When the browser fails to load the image (src=x is invalid), the onerror event fires and executes our JavaScript. This works even when <script> tags are filtered.',
          vulnerable: true
        },
        {
          title: 'Properly Encoded Output',
          code: '&lt;script&gt;alert(1)&lt;/script&gt;',
          explanation: 'When properly encoded, the < and > characters are converted to HTML entities (&lt; and &gt;). The browser displays this as text instead of executing it as code.',
          vulnerable: false
        }
      ]
    },
    challenges: ['intro-xss-1', 'intro-xss-2', 'intro-xss-3'],
    quiz: [
      {
        id: 'q1',
        question: 'What does XSS stand for?',
        options: [
          'Cross-Site Scripting',
          'Cross-Site Security',
          'Cross-Server Scripting',
          'Cross-System Scripts'
        ],
        correctAnswer: 0,
        explanation: 'XSS stands for Cross-Site Scripting. The "X" is used instead of "C" to avoid confusion with Cascading Style Sheets (CSS).'
      },
      {
        id: 'q2',
        question: 'Which type of XSS is stored permanently on the server?',
        options: [
          'Reflected XSS',
          'Stored XSS',
          'DOM-based XSS',
          'Server-side XSS'
        ],
        correctAnswer: 1,
        explanation: 'Stored XSS (also called Persistent XSS) is permanently stored on the target server, such as in a database or comment field.'
      },
      {
        id: 'q3',
        question: 'What can an attacker steal using XSS?',
        options: [
          'Only usernames',
          'Only passwords',
          'Session cookies and sensitive data',
          'Only IP addresses'
        ],
        correctAnswer: 2,
        explanation: 'XSS can be used to steal session cookies, authentication tokens, and any sensitive data accessible to JavaScript in the page context.'
      },
      {
        id: 'q4',
        question: 'Which defense technique converts < > to HTML entities?',
        options: [
          'Input validation',
          'Output encoding',
          'Content Security Policy',
          'HTTPOnly cookies'
        ],
        correctAnswer: 1,
        explanation: 'Output encoding converts special characters like < and > to their HTML entity equivalents (&lt; and &gt;), preventing them from being interpreted as code.'
      },
      {
        id: 'q5',
        question: 'In DOM-based XSS, where does the vulnerability exist?',
        options: [
          'Server-side code',
          'Database queries',
          'Client-side JavaScript',
          'HTTP headers'
        ],
        correctAnswer: 2,
        explanation: 'DOM-based XSS vulnerabilities exist in client-side JavaScript code that insecurely processes user-controlled data without server involvement.'
      }
    ]
  },

  'basic-payloads': {
    id: 'basic-payloads',
    title: 'Basic XSS Payloads',
    description: 'Learn fundamental XSS payload structures and techniques',
    path: 'beginner',
    order: 2,
    estimatedMinutes: 45,
    objectives: [
      'Construct basic script tag payloads',
      'Use event handlers for XSS execution',
      'Understand SVG-based XSS vectors',
      'Test payloads in different contexts'
    ],
    content: {
      theory: `# Basic XSS Payload Types

Now that you understand what XSS is, let's learn how to construct effective payloads. We'll start with the fundamentals that form the foundation of all XSS attacks.

## 1. Script Tags

The most straightforward XSS vector is the \`<script>\` tag. Any JavaScript between \`<script>\` and \`</script>\` will be executed by the browser.

### Basic Script Execution

\`\`\`html
<script>alert(1)</script>
<script>alert('XSS')</script>
<script>alert(document.domain)</script>
\`\`\`

### Why alert()?

You'll see \`alert()\` used frequently in XSS demonstrations because:
- It's a **visual proof** that code executed
- It's **harmless** (just shows a popup)
- It **doesn't require a server** to receive data

In real attacks, alert() would be replaced with code to steal data, modify the page, or attack other users.

## 2. Event Handlers

HTML elements support **event handlers** that execute JavaScript when events occur (clicks, errors, loads, etc.). These are powerful because they work even when \`<script>\` tags are filtered.

### Common Event Handlers

\`\`\`html
<!-- Image with error handler -->
<img src=x onerror=alert(1)>

<!-- SVG with load handler -->
<svg onload=alert(1)>

<!-- Body with load handler -->
<body onload=alert(1)>

<!-- Input with focus handler -->
<input onfocus=alert(1) autofocus>

<!-- Div with mouseover -->
<div onmouseover=alert(1)>Hover me</div>
\`\`\`

### Why onerror is Popular

The \`onerror\` event handler on \`<img>\` tags is extremely common because:
- It triggers **automatically** when the image fails to load
- Using \`src=x\` or \`src=invalid\` guarantees failure
- No user interaction required

## 3. SVG-Based XSS

Scalable Vector Graphics (SVG) elements provide another execution context:

\`\`\`html
<!-- SVG with inline script -->
<svg><script>alert(1)</script></svg>

<!-- SVG with onload -->
<svg onload=alert(1)>

<!-- SVG with animate event -->
<svg><animate onbegin=alert(1) />
\`\`\`

SVG is useful because:
- SVG tags can contain \`<script>\` tags
- Many SVG elements support event handlers
- Some filters forget to check SVG tags

## Quote and Whitespace Variations

Browsers are **flexible** with HTML syntax, which helps bypass basic filters:

### Quote Variations
\`\`\`html
<img src=x onerror=alert(1)>        <!-- No quotes -->
<img src=x onerror="alert(1)">      <!-- Double quotes -->
<img src=x onerror='alert(1)'>      <!-- Single quotes -->
\`\`\`

### Whitespace Variations
\`\`\`html
<img src=x onerror=alert(1)>        <!-- No spaces -->
<img   src=x   onerror=alert(1)>    <!-- Extra spaces -->
<img\tsrc=x\tonerror=alert(1)>      <!-- Tab characters -->
<img\nsrc=x\nonerror=alert(1)>      <!-- Newlines -->
\`\`\`

## Choosing the Right Payload

The "best" payload depends on the context:

- **No filtering**: Use simple \`<script>alert(1)</script>\`
- **Script tags blocked**: Use event handlers like \`<img src=x onerror=alert(1)>\`
- **Attribute injection**: Break out with \`" onerror="alert(1)\`
- **Inside JavaScript**: Use \`</script><img src=x onerror=alert(1)>\`

## Testing Your Payloads

When testing XSS, always:
1. **Start simple** - try basic payloads first
2. **Observe the response** - view source to see how your input was filtered
3. **Adapt** - modify your payload based on what was blocked
4. **Iterate** - keep trying different techniques`,

      examples: [
        {
          title: 'Script Tag - Basic',
          code: '<script>alert(1)</script>',
          explanation: 'The most basic XSS payload. Executes JavaScript immediately when the page loads.',
          vulnerable: true
        },
        {
          title: 'Image Error Handler',
          code: '<img src=x onerror=alert(1)>',
          explanation: 'Uses the onerror event which fires when the image fails to load. Works even when <script> is filtered.',
          vulnerable: true
        },
        {
          title: 'SVG with Onload',
          code: '<svg onload=alert(1)>',
          explanation: 'SVG elements support event handlers. This payload executes when the SVG loads.',
          vulnerable: true
        },
        {
          title: 'Input with Autofocus',
          code: '<input onfocus=alert(1) autofocus>',
          explanation: 'The autofocus attribute automatically focuses the input, triggering the onfocus event immediately.',
          vulnerable: true
        }
      ]
    },
    challenges: ['basic-payload-1', 'basic-payload-2', 'basic-payload-3'],
    quiz: [
      {
        id: 'q1',
        question: 'Which HTML tag is the most straightforward XSS vector?',
        options: [
          '<img>',
          '<script>',
          '<div>',
          '<a>'
        ],
        correctAnswer: 1,
        explanation: 'The <script> tag is designed to execute JavaScript, making it the most straightforward XSS vector.'
      },
      {
        id: 'q2',
        question: 'Why is alert() commonly used in XSS demonstrations?',
        options: [
          'It steals user data',
          'It provides visual proof of execution without harm',
          'It bypasses all filters',
          'It only works in XSS attacks'
        ],
        correctAnswer: 1,
        explanation: 'alert() is used in demonstrations because it provides immediate visual proof that code executed, without causing harm or requiring external infrastructure.'
      },
      {
        id: 'q3',
        question: 'What event handler commonly fires when an image fails to load?',
        options: [
          'onclick',
          'onload',
          'onerror',
          'onmouseover'
        ],
        correctAnswer: 2,
        explanation: 'The onerror event handler fires when an element (like an image) fails to load, making it perfect for XSS: <img src=x onerror=alert(1)>'
      },
      {
        id: 'q4',
        question: 'Can SVG elements contain <script> tags?',
        options: [
          'No, never',
          'Yes, SVG elements can contain script tags',
          'Only in XML mode',
          'Only with special headers'
        ],
        correctAnswer: 1,
        explanation: 'SVG elements can contain <script> tags, making them a valid XSS vector: <svg><script>alert(1)</script></svg>'
      },
      {
        id: 'q5',
        question: 'Which attribute makes an input field automatically focused?',
        options: [
          'autoload',
          'autofocus',
          'autoclick',
          'autoselect'
        ],
        correctAnswer: 1,
        explanation: 'The autofocus attribute automatically focuses an input element when the page loads, which can trigger onfocus event handlers.'
      }
    ]
  },

  'html-context': {
    id: 'html-context',
    title: 'HTML Context Injection',
    description: 'Master XSS in different HTML contexts and learn context-aware payloads',
    path: 'beginner',
    order: 3,
    estimatedMinutes: 45,
    objectives: [
      'Understand injection contexts',
      'Craft context-specific payloads',
      'Break out of attribute contexts',
      'Identify vulnerable injection points'
    ],
    content: {
      theory: `# HTML Context Injection

Not all XSS injections are the same. The **context** where your input appears determines which payloads will work. Understanding injection contexts is crucial for successful XSS exploitation.

## Understanding Contexts

When user input is inserted into HTML, it can appear in different locations:

1. **HTML Body** - Between tags
2. **HTML Attributes** - Inside tag attributes
3. **JavaScript** - Inside script blocks
4. **URLs** - In href or src attributes
5. **CSS** - In style blocks or attributes

Each context requires different techniques.

## 1. HTML Body Context

When your input appears directly in the HTML body:

\`\`\`html
<div>Your input here</div>
\`\`\`

**Injection Strategy:** Inject HTML tags directly

\`\`\`html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
\`\`\`

This is the **easiest** context because you can inject complete HTML tags.

## 2. HTML Attribute Context

When your input appears inside an HTML attribute:

\`\`\`html
<input type="text" value="Your input here">
\`\`\`

**Injection Strategy:** Close the attribute and add event handlers

\`\`\`html
" autofocus onfocus=alert(1) x="
' autofocus onfocus=alert(1) x='
\`\`\`

Result:
\`\`\`html
<input type="text" value="" autofocus onfocus=alert(1) x="">
\`\`\`

## 3. Breaking Out of Attributes

Sometimes you need to **close the entire tag** first:

\`\`\`html
<input type="text" value="Your input here">
\`\`\`

**Payload:**
\`\`\`html
"><img src=x onerror=alert(1)>
\`\`\`

**Result:**
\`\`\`html
<input type="text" value=""><img src=x onerror=alert(1)>">
\`\`\`

The browser sees:
1. An input tag (closed by \`">\`)
2. An img tag with onerror

## 4. JavaScript String Context

When your input is inside a JavaScript string:

\`\`\`html
<script>
  var search = 'Your input here';
</script>
\`\`\`

**Injection Strategy:** Close the string and execute code

\`\`\`javascript
'; alert(1); //
'; alert(1); var x='
\`\`\`

**Result:**
\`\`\`javascript
var search = ''; alert(1); //';
\`\`\`

## 5. URL/Href Context

When your input appears in a URL:

\`\`\`html
<a href="Your input here">Click</a>
\`\`\`

**Injection Strategy:** Use the javascript: protocol

\`\`\`html
javascript:alert(1)
javascript:alert(document.domain)
\`\`\`

**Result:**
\`\`\`html
<a href="javascript:alert(1)">Click</a>
\`\`\`

## Context Detection

Always ask yourself:

1. **Where does my input appear?** (View page source)
2. **Is it inside a tag?** (Between \`<\` and \`>\`)
3. **Is it inside quotes?** (Single or double?)
4. **Is it inside JavaScript?** (Between \`<script>\` tags)

## Defense Mechanisms by Context

Different contexts require different encoding:

| Context | Required Encoding |
|---------|------------------|
| HTML Body | HTML entity encoding (\`&lt;\`, \`&gt;\`) |
| HTML Attribute | HTML entity + attribute encoding |
| JavaScript | JavaScript escaping (\`\\'\`, \`\\"\`) |
| URL | URL encoding (\`%3C\`, \`%3E\`) |
| CSS | CSS escaping |

Proper context-aware encoding prevents XSS.`,

      examples: [
        {
          title: 'HTML Body Context',
          code: '<div>USER_INPUT</div>\n\nPayload: <script>alert(1)</script>',
          explanation: 'Direct HTML injection works because we can insert complete HTML tags in the body context.',
          vulnerable: true
        },
        {
          title: 'Attribute Context Breakout',
          code: '<input value="USER_INPUT">\n\nPayload: " onfocus=alert(1) autofocus x="',
          explanation: 'Close the value attribute with a quote, add our event handler, then open a new dummy attribute.',
          vulnerable: true
        },
        {
          title: 'JavaScript String Context',
          code: '<script>var x="USER_INPUT";</script>\n\nPayload: "; alert(1); //',
          explanation: 'Close the string with a quote, execute our code, then comment out the rest with //.',
          vulnerable: true
        },
        {
          title: 'URL Context',
          code: '<a href="USER_INPUT">Link</a>\n\nPayload: javascript:alert(1)',
          explanation: 'The javascript: protocol allows code execution when the link is clicked.',
          vulnerable: true
        }
      ]
    },
    challenges: ['html-context-1', 'html-context-2', 'html-context-3'],
    quiz: [
      {
        id: 'q1',
        question: 'Which context is easiest for XSS injection?',
        options: [
          'JavaScript string context',
          'HTML attribute context',
          'HTML body context',
          'CSS context'
        ],
        correctAnswer: 2,
        explanation: 'HTML body context is easiest because you can inject complete HTML tags directly without needing to break out of any containers.'
      },
      {
        id: 'q2',
        question: 'How do you break out of a quoted attribute value?',
        options: [
          'Use a backslash',
          'Use a semicolon',
          'Close the quote, then inject',
          'Use HTML comments'
        ],
        correctAnswer: 2,
        explanation: 'To break out of a quoted attribute, you need to close the quote first (with " or \'), then you can inject additional attributes or tags.'
      },
      {
        id: 'q3',
        question: 'What protocol can execute JavaScript in href attributes?',
        options: [
          'http:',
          'javascript:',
          'data:',
          'file:'
        ],
        correctAnswer: 1,
        explanation: 'The javascript: protocol allows JavaScript code execution in href attributes: <a href="javascript:alert(1)">Link</a>'
      },
      {
        id: 'q4',
        question: 'In JavaScript string context, what closes a string?',
        options: [
          'A semicolon',
          'A backslash',
          'A matching quote (single or double)',
          'A closing parenthesis'
        ],
        correctAnswer: 2,
        explanation: 'JavaScript strings are closed by matching quotes - a string starting with \' must be closed with \', and " with ".'
      },
      {
        id: 'q5',
        question: 'Why does context matter for XSS?',
        options: [
          'It doesn\'t matter',
          'Different contexts require different payload techniques',
          'Only for defense',
          'Only for advanced XSS'
        ],
        correctAnswer: 1,
        explanation: 'Context determines which characters are special and how to construct effective payloads. A payload that works in HTML body may not work inside an attribute.'
      }
    ]
  },

  // Lesson 4: Filter Bypasses
  'filter-bypasses': {
    id: 'filter-bypasses',
    title: 'Filter Bypass Techniques',
    description: 'Learn advanced techniques to bypass common XSS filters and security controls',
    path: 'beginner',
    order: 4,
    estimatedMinutes: 60,
    objectives: [
      'Understand common XSS filter patterns',
      'Master case variation and encoding techniques',
      'Use nested tags to bypass filters',
      'Exploit alternative event handlers'
    ],
    content: {
      theory: `# Filter Bypass Techniques

When developers implement XSS protection, they often use simple filters that block common patterns like \`<script>\` or \`alert\`. However, these filters can frequently be bypassed using various techniques.

## Common Filter Types

### 1. Blacklist Filters
These filters block specific keywords or patterns:
- Blocking \`<script>\` tags
- Blocking \`javascript:\` protocol
- Blocking \`alert\`, \`eval\`, \`prompt\`

**Problem:** Attackers can use alternatives or encoding to bypass.

### 2. Case-Sensitive Filters
Filters that only match lowercase or specific casing.

**Bypass:** Use mixed case like \`<ScRiPt>\` or \`oNeRrOr\`

### 3. Incomplete Sanitization
Filters that remove patterns but don't loop:
- Removing \`<script>\` once leaves \`<scr<script>ipt>\` → \`<script>\`

## Bypass Techniques

### Technique 1: Case Variation
\`\`\`html
// Filter blocks: <script>
// Bypass with:
<ScRiPt>alert(1)</sCrIpT>
<SCRIPT>alert(1)</SCRIPT>
\`\`\`

### Technique 2: Nested Tags
\`\`\`html
// Filter removes <script>
// Bypass with:
<scr<script>ipt>alert(1)</scr</script>ipt>
// After filter removes inner <script>: <script>alert(1)</script>
\`\`\`

### Technique 3: Alternative Event Handlers
\`\`\`html
// If <img onerror> is blocked, try:
<body onload=alert(1)>
<svg onload=alert(1)>
<details open ontoggle=alert(1)>
<marquee onstart=alert(1)>
\`\`\`

### Technique 4: Encoding
\`\`\`html
// HTML entity encoding
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">

// URL encoding (in href)
<a href="javascript:%61%6c%65%72%74(1)">

// Unicode escapes (in JavaScript context)
<script>\\u0061\\u006c\\u0065\\u0072\\u0074(1)</script>
\`\`\`

### Technique 5: String Concatenation
\`\`\`javascript
// If 'alert' is blocked in JavaScript context:
eval('ale'+'rt(1)')
window['ale'+'rt'](1)
\`\`\`

## Defense Against Bypasses

The only reliable defense is **proper output encoding** based on context, not blacklist filtering:

- **HTML Context:** HTML entity encode \`< > " ' &\`
- **Attribute Context:** HTML attribute encode all non-alphanumeric
- **JavaScript Context:** JavaScript string escape or JSON encode
- **URL Context:** URL encode

**Always validate input on the server side** and never rely solely on client-side filtering.`,
      examples: [
        {
          title: 'Case Variation Bypass',
          code: `// Filter blocks: <script>
// Vulnerable code:
if (input.includes('<script>')) {
  return 'Blocked';
}

// Bypass:
<ScRiPt>alert(1)</sCrIpT>`,
          explanation: 'Case-sensitive filters fail when attackers use mixed or uppercase variations. HTML is case-insensitive for tag names.',
          vulnerable: true
        },
        {
          title: 'Nested Tag Bypass',
          code: `// Filter: input.replace('<script>', '')
// Vulnerable code:
sanitized = input.replace('<script>', '');

// Bypass:
<scr<script>ipt>alert(1)</scr</script>ipt>

// After filter runs once:
<script>alert(1)</script>`,
          explanation: 'Single-pass filters can be bypassed by nesting the blocked pattern within itself. After removal, the payload reconstructs.',
          vulnerable: true
        },
        {
          title: 'Alternative Event Handler',
          code: `// If <img onerror> is filtered
// Try alternatives:
<svg/onload=alert(1)>
<body onload=alert(1)>
<marquee onstart=alert(1)>
<details open ontoggle=alert(1)>`,
          explanation: 'There are dozens of HTML event handlers. Blocking one still leaves many alternatives available.',
          vulnerable: true
        },
        {
          title: 'HTML Entity Encoding',
          code: `// JavaScript in attribute encoded as HTML entities:
<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">

// Decodes to:
<img src=x onerror="alert(1)">`,
          explanation: 'HTML entities are decoded before JavaScript execution. This can bypass filters looking for literal "alert" string.',
          vulnerable: true
        }
      ]
    },
    challenges: ['filter-bypass-1', 'filter-bypass-2', 'filter-bypass-3', 'filter-bypass-4'],
    quiz: [
      {
        id: 'q1',
        question: 'Why do case variation bypasses work against HTML filters?',
        options: [
          'HTML is case-sensitive',
          'HTML tag names are case-insensitive',
          'Browsers ignore uppercase tags',
          'JavaScript is case-insensitive'
        ],
        correctAnswer: 1,
        explanation: 'HTML tag names are case-insensitive, so <script>, <SCRIPT>, and <ScRiPt> all work identically. Filters checking only lowercase can be bypassed.'
      },
      {
        id: 'q2',
        question: 'What is the problem with single-pass sanitization filters?',
        options: [
          'They are too slow',
          'They can be bypassed with nested payloads',
          'They break legitimate input',
          'They only work on the client side'
        ],
        correctAnswer: 1,
        explanation: 'Single-pass filters that remove patterns without looping can be bypassed by nesting. For example, <scr<script>ipt> becomes <script> after one removal.'
      },
      {
        id: 'q3',
        question: 'Which is the most reliable XSS defense?',
        options: [
          'Blacklisting dangerous keywords',
          'Client-side input validation',
          'Context-aware output encoding',
          'Removing all special characters'
        ],
        correctAnswer: 2,
        explanation: 'Context-aware output encoding is the only reliable defense. It ensures dangerous characters are escaped based on where data appears (HTML, attribute, JavaScript, etc.).'
      },
      {
        id: 'q4',
        question: 'How can HTML entity encoding bypass filters?',
        options: [
          'It makes payloads invisible',
          'Entities are decoded before JavaScript execution',
          'It converts JavaScript to HTML',
          'Entities disable XSS filters'
        ],
        correctAnswer: 1,
        explanation: 'HTML entities like &#97; (letter "a") are decoded by the browser before JavaScript executes. Filters looking for literal strings like "alert" won\'t find encoded versions.'
      },
      {
        id: 'q5',
        question: 'What should developers do instead of blacklist filtering?',
        options: [
          'Use more comprehensive blacklists',
          'Block all user input',
          'Apply proper output encoding based on context',
          'Only allow alphanumeric characters'
        ],
        correctAnswer: 2,
        explanation: 'Proper output encoding (HTML entity encoding, JavaScript escaping, URL encoding) based on injection context is the correct approach. Blacklists can always be bypassed.'
      }
    ]
  },

  // Lesson 5: Detection and Prevention
  'detection-prevention': {
    id: 'detection-prevention',
    title: 'XSS Detection & Prevention',
    description: 'Learn how to detect XSS vulnerabilities and implement robust defenses',
    path: 'beginner',
    order: 5,
    estimatedMinutes: 45,
    objectives: [
      'Understand Content Security Policy (CSP)',
      'Implement proper output encoding',
      'Use security headers effectively',
      'Apply defense-in-depth strategies'
    ],
    content: {
      theory: `# XSS Detection & Prevention

Preventing XSS requires a multi-layered defense strategy. No single technique is sufficient on its own.

## Detection Techniques

### 1. Static Code Analysis
Tools that scan source code for XSS vulnerabilities:
- ESLint security plugins
- Semgrep rules
- SonarQube
- CodeQL

**What they detect:**
- Dangerous sinks (\`innerHTML\`, \`eval\`, \`document.write\`)
- Unvalidated user input
- Missing output encoding

### 2. Dynamic Testing
Testing running applications:
- Manual payload injection
- Automated scanners (Burp Suite, OWASP ZAP)
- Fuzzing tools
- Browser extensions

### 3. Code Review
Manual review focusing on:
- Data flow from sources to sinks
- Context-appropriate encoding
- Use of dangerous functions
- Framework security features

## Prevention Strategies

### Strategy 1: Output Encoding

**HTML Context:**
\`\`\`javascript
// Encode: < > " ' &
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// Safe usage:
element.textContent = userInput;  // Browser encodes automatically
element.innerHTML = escapeHTML(userInput);
\`\`\`

**JavaScript Context:**
\`\`\`javascript
// Use JSON.stringify for data
const safeData = JSON.stringify(userInput);
script.textContent = \`const data = \${safeData};\`;

// Never use string concatenation:
// BAD: script.textContent = 'var x = "' + userInput + '";'
\`\`\`

**URL Context:**
\`\`\`javascript
// Use encodeURIComponent
const safeURL = '/search?q=' + encodeURIComponent(userInput);
\`\`\`

**Attribute Context:**
\`\`\`javascript
// Encode for attributes
element.setAttribute('data-value', userInput); // Safe
// element.innerHTML = '<div data-value="' + userInput + '">'; // Unsafe!
\`\`\`

### Strategy 2: Content Security Policy (CSP)

CSP is an HTTP header that restricts resource loading and inline code execution.

**Example CSP Headers:**
\`\`\`http
# Block all inline scripts and only allow scripts from same origin
Content-Security-Policy: script-src 'self'

# Allow scripts from specific CDNs
Content-Security-Policy: script-src 'self' https://cdn.example.com

# Strict CSP with nonces
Content-Security-Policy: script-src 'nonce-{random-value}'
\`\`\`

**Benefits:**
- Blocks inline \`<script>\` tags
- Prevents \`eval()\` and similar functions
- Restricts external script sources
- Mitigates impact of XSS even if injection occurs

### Strategy 3: Security Headers

**X-Content-Type-Options:**
\`\`\`http
X-Content-Type-Options: nosniff
\`\`\`
Prevents MIME type sniffing attacks.

**X-Frame-Options:**
\`\`\`http
X-Frame-Options: DENY
\`\`\`
Prevents clickjacking (not XSS but related).

**Referrer-Policy:**
\`\`\`http
Referrer-Policy: strict-origin-when-cross-origin
\`\`\`
Controls referrer information leakage.

### Strategy 4: Framework Security Features

Modern frameworks have built-in XSS protection:

**React:**
\`\`\`jsx
// Safe by default - JSX escapes automatically
<div>{userInput}</div>

// Dangerous - only use with trusted HTML
<div dangerouslySetInnerHTML={{__html: trustedHTML}} />
\`\`\`

**Vue.js:**
\`\`\`vue
<!-- Safe - v-text escapes automatically -->
<div v-text="userInput"></div>

<!-- Dangerous - v-html doesn't escape -->
<div v-html="trustedHTML"></div>
\`\`\`

**Angular:**
\`\`\`typescript
// Safe - automatic sanitization
<div>{{userInput}}</div>

// Bypass sanitizer (dangerous)
<div [innerHTML]="bypassSecurityTrustHtml(html)"></div>
\`\`\`

### Strategy 5: Input Validation

**Important:** Input validation is NOT sufficient for XSS prevention, but it adds defense-in-depth.

\`\`\`javascript
// Validate expected format
function validateEmail(email) {
  const emailRegex = /^[\\w.-]+@[\\w.-]+\\.\\w+$/;
  return emailRegex.test(email);
}

// Reject unexpected input
if (!validateEmail(userEmail)) {
  return 'Invalid email format';
}
\`\`\`

## Defense-in-Depth Checklist

✅ Output encode based on context
✅ Use framework security features
✅ Implement strict CSP headers
✅ Enable security headers (X-Content-Type-Options, etc.)
✅ Validate input format (but don't rely on it for XSS prevention)
✅ Use static analysis tools in CI/CD
✅ Conduct regular security testing
✅ Keep dependencies updated
✅ Review code for dangerous patterns

**Remember:** Output encoding is the primary defense. Everything else is additional layers.`,
      examples: [
        {
          title: 'Safe HTML Encoding',
          code: `// Vulnerable:
element.innerHTML = '<p>' + userInput + '</p>';

// Safe Option 1 - Use textContent:
const p = document.createElement('p');
p.textContent = userInput;
element.appendChild(p);

// Safe Option 2 - Encode then use innerHTML:
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
element.innerHTML = '<p>' + escapeHTML(userInput) + '</p>';`,
          explanation: 'textContent automatically encodes special characters. Alternatively, create a temporary element and use its innerHTML to get the encoded version.',
          vulnerable: false
        },
        {
          title: 'Content Security Policy',
          code: `<!-- In HTML head or via HTTP header -->
<meta http-equiv="Content-Security-Policy"
      content="script-src 'self'; object-src 'none';">

<!-- This will be blocked by CSP: -->
<script>alert(1)</script>

<!-- Only scripts from same origin will execute -->
<script src="/js/app.js"></script>`,
          explanation: 'CSP blocks inline scripts and restricts external sources. Even if XSS payload is injected, it won\'t execute.',
          vulnerable: false
        },
        {
          title: 'React Safe By Default',
          code: `// React automatically escapes in JSX:
function UserProfile({ username }) {
  // Safe - even if username contains <script>
  return <div>Hello {username}</div>;
}

// Dangerous - only use with sanitized HTML:
function RichContent({ html }) {
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}`,
          explanation: 'React\'s JSX syntax automatically escapes values in {curly braces}. Only use dangerouslySetInnerHTML with trusted, sanitized content.',
          vulnerable: false
        }
      ]
    },
    challenges: ['detection-prevention-1', 'detection-prevention-2', 'detection-prevention-3'],
    quiz: [
      {
        id: 'q1',
        question: 'What is the PRIMARY defense against XSS?',
        options: [
          'Input validation',
          'Content Security Policy',
          'Context-aware output encoding',
          'Web Application Firewall'
        ],
        correctAnswer: 2,
        explanation: 'Context-aware output encoding is the primary defense. It ensures dangerous characters are properly escaped based on where data appears (HTML, JavaScript, URL, etc.).'
      },
      {
        id: 'q2',
        question: 'What does Content Security Policy (CSP) do?',
        options: [
          'Encrypts all website data',
          'Restricts where scripts can be loaded from',
          'Validates user input',
          'Encodes HTML output'
        ],
        correctAnswer: 1,
        explanation: 'CSP is an HTTP header that controls which sources can load scripts, styles, and other resources. It blocks inline scripts and restricts external sources.'
      },
      {
        id: 'q3',
        question: 'Which React code is safe from XSS?',
        options: [
          '<div dangerouslySetInnerHTML={{__html: userInput}} />',
          '<div>{userInput}</div>',
          'element.innerHTML = userInput',
          'eval(userInput)'
        ],
        correctAnswer: 1,
        explanation: 'React automatically escapes values in JSX {curly braces}. dangerouslySetInnerHTML, innerHTML, and eval are all dangerous with user input.'
      },
      {
        id: 'q4',
        question: 'Why is input validation NOT sufficient for XSS prevention?',
        options: [
          'It\'s too slow',
          'It can\'t validate all input types',
          'Attackers can bypass validation, and some valid input contains special characters',
          'It only works on the server'
        ],
        correctAnswer: 2,
        explanation: 'Input validation can be bypassed, and legitimate input often contains characters like <, >, & (e.g., in names like "O\'Brien"). Output encoding handles these safely.'
      },
      {
        id: 'q5',
        question: 'Which is the safest way to insert user data into the DOM?',
        options: [
          'element.innerHTML = userInput',
          'element.textContent = userInput',
          'document.write(userInput)',
          'eval("var x = " + userInput)'
        ],
        correctAnswer: 1,
        explanation: 'textContent automatically encodes special characters as text, making it safe. innerHTML, document.write, and eval are dangerous with user input.'
      }
    ]
  }
};

// Challenge Definitions
export const challenges = {
  // Intro to XSS challenges
  'intro-xss-1': {
    id: 'intro-xss-1',
    lessonId: 'intro-to-xss',
    title: 'Your First XSS',
    description: 'Inject a basic XSS payload into a vulnerable search field',
    difficulty: 'easy',
    type: 'payload-injection',
    points: 10,
    scenario: {
      description: 'A search form reflects your input without any sanitization or encoding. This is the most basic type of reflected XSS vulnerability.',
      vulnerableCode: `function displaySearch(query) {
  document.getElementById('results').innerHTML =
    '<p>Search results for: ' + query + '</p>';
}`,
      context: 'html',
      filterType: 'none',
      hint: 'Try injecting a <script> tag that shows an alert'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<script', 'alert', '</script>'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '<script>alert(1)</script>',
    explanation: 'The search form directly inserts user input into innerHTML without encoding, allowing script execution. This is the most basic XSS vulnerability.'
  },

  'intro-xss-2': {
    id: 'intro-xss-2',
    lessonId: 'intro-to-xss',
    title: 'Image Error Handler',
    description: 'Use an image tag with an error handler instead of a script tag',
    difficulty: 'easy',
    type: 'payload-injection',
    points: 10,
    scenario: {
      description: 'The application reflects your input but in a context where you want to demonstrate an alternative to script tags.',
      vulnerableCode: `function displayContent(input) {
  document.getElementById('output').innerHTML = input;
}`,
      context: 'html',
      filterType: 'none',
      hint: 'Use an <img> tag with an invalid src and an onerror handler'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<img', 'onerror', 'alert'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '<img src=x onerror=alert(1)>',
    explanation: 'The onerror event handler executes when the image fails to load. Setting src to an invalid value (like "x") guarantees the error event will fire.'
  },

  'intro-xss-3': {
    id: 'intro-xss-3',
    lessonId: 'intro-to-xss',
    title: 'SVG Vector',
    description: 'Use an SVG-based XSS payload',
    difficulty: 'easy',
    type: 'payload-injection',
    points: 10,
    scenario: {
      description: 'Another vulnerable reflection point. Try using SVG elements for code execution.',
      vulnerableCode: `function render(userInput) {
  document.body.innerHTML += userInput;
}`,
      context: 'html',
      filterType: 'none',
      hint: 'SVG elements support the onload event handler'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<svg', 'onload', 'alert'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '<svg onload=alert(1)>',
    explanation: 'SVG elements support event handlers like onload. This payload executes JavaScript when the SVG element loads in the page.'
  },

  // Basic Payloads challenges
  'basic-payload-1': {
    id: 'basic-payload-1',
    lessonId: 'basic-payloads',
    title: 'Script Tag Blocked',
    description: 'The application blocks <script> tags. Use an event handler instead.',
    difficulty: 'easy',
    type: 'filter-bypass',
    points: 15,
    scenario: {
      description: 'A basic filter removes <script> tags from user input.',
      vulnerableCode: `function sanitize(input) {
  return input.replace(/<script[^>]*>.*?<\\/script>/gi, '');
}`,
      context: 'html',
      filterType: 'basic',
      hint: 'Remember: HTML elements have many event handlers that can execute JavaScript'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['on\\w+\\s*=', 'alert'],
      requiredAll: true,
      checkExecution: true,
      bannedPatterns: ['<script']
    },
    solution: '<img src=x onerror=alert(1)>',
    explanation: 'Since <script> tags are filtered, we use an event handler instead. The onerror event fires when the image fails to load, executing our JavaScript.'
  },

  'basic-payload-2': {
    id: 'basic-payload-2',
    lessonId: 'basic-payloads',
    title: 'Multiple Event Handlers',
    description: 'Experiment with different event handlers to trigger XSS',
    difficulty: 'easy',
    type: 'payload-injection',
    points: 15,
    scenario: {
      description: 'Find an event handler that executes automatically without user interaction.',
      vulnerableCode: `function display(content) {
  document.getElementById('output').innerHTML = content;
}`,
      context: 'html',
      filterType: 'none',
      hint: 'Look for event handlers that trigger automatically: onload, onerror, autofocus+onfocus'
    },
    validation: {
      type: 'custom-function',
      validator: (payload, filtered, executed) => {
        // Must use an event handler and execute
        const hasEventHandler = /on\w+\s*=/i.test(payload);
        return hasEventHandler && executed;
      }
    },
    solution: '<svg onload=alert(1)>',
    explanation: 'The onload event on SVG elements fires automatically when the element loads, providing immediate code execution without user interaction.'
  },

  'basic-payload-3': {
    id: 'basic-payload-3',
    lessonId: 'basic-payloads',
    title: 'Input Autofocus',
    description: 'Use an input element with autofocus to trigger an event',
    difficulty: 'medium',
    type: 'payload-injection',
    points: 20,
    scenario: {
      description: 'Create a payload using an input element that automatically executes code when the page loads.',
      vulnerableCode: `function insertContent(html) {
  document.getElementById('container').innerHTML = html;
}`,
      context: 'html',
      filterType: 'none',
      hint: 'The autofocus attribute automatically focuses an input, and onfocus executes when focus occurs'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<input', 'autofocus', 'onfocus', 'alert'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '<input onfocus=alert(1) autofocus>',
    explanation: 'The autofocus attribute automatically focuses the input element when the page loads, which triggers the onfocus event handler immediately.'
  },

  // HTML Context challenges
  'html-context-1': {
    id: 'html-context-1',
    lessonId: 'html-context',
    title: 'Attribute Breakout',
    description: 'Your input appears inside an HTML attribute. Break out and inject XSS.',
    difficulty: 'medium',
    type: 'context-breaking',
    points: 20,
    scenario: {
      description: 'Your input is placed inside the value attribute of an input element. You need to close the attribute first.',
      vulnerableCode: `function createInput(userValue) {
  return '<input type="text" value="' + userValue + '">';
}`,
      context: 'attribute',
      filterType: 'none',
      hint: 'Close the value attribute with a quote, then add your own attribute with an event handler'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['"', 'on\\w+\\s*=', 'alert'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '" onfocus=alert(1) autofocus x="',
    explanation: 'We close the value attribute with a quote, add onfocus=alert(1) autofocus, then open a dummy attribute (x=") to consume the remaining quote. Result: <input type="text" value="" onfocus=alert(1) autofocus x="">'
  },

  'html-context-2': {
    id: 'html-context-2',
    lessonId: 'html-context',
    title: 'Tag Breakout',
    description: 'Break out of the tag entirely and inject a new element',
    difficulty: 'medium',
    type: 'context-breaking',
    points: 20,
    scenario: {
      description: 'Your input is in an attribute. Close the entire tag and inject a new malicious element.',
      vulnerableCode: `function makeLink(url) {
  return '<a href="' + url + '">Click here</a>';
}`,
      context: 'attribute',
      filterType: 'none',
      hint: 'Use "> to close the tag, then inject a new tag like <img> or <svg>'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['">', '<\\w+', 'on\\w+\\s*=', 'alert'],
      requiredAll: true,
      checkExecution: true
    },
    solution: '"><img src=x onerror=alert(1)>',
    explanation: 'We close the href attribute and the <a> tag with ">, then inject a complete new element: <img src=x onerror=alert(1)>. The browser sees two separate elements.'
  },

  'html-context-3': {
    id: 'html-context-3',
    lessonId: 'html-context',
    title: 'JavaScript Protocol',
    description: 'Use the javascript: protocol in a URL context',
    difficulty: 'medium',
    type: 'payload-injection',
    points: 20,
    scenario: {
      description: 'Your input is used as the href value in a link. The application expects a URL.',
      vulnerableCode: `function createLink(destination) {
  return '<a href="' + destination + '">Click me</a>';
}`,
      context: 'url',
      filterType: 'none',
      hint: 'URLs can use different protocols. Try the javascript: protocol'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['javascript:', 'alert'],
      requiredAll: true,
      checkExecution: false  // Requires click, so don't check auto-execution
    },
    solution: 'javascript:alert(1)',
    explanation: 'The javascript: protocol allows JavaScript execution in URL contexts. When the link is clicked, the code after javascript: executes: <a href="javascript:alert(1)">Click me</a>'
  },

  // Filter Bypass challenges
  'filter-bypass-1': {
    id: 'filter-bypass-1',
    lessonId: 'filter-bypasses',
    title: 'Case Variation Bypass',
    description: 'Bypass a case-sensitive script tag filter',
    difficulty: 'easy',
    type: 'payload-injection',
    points: 15,
    scenario: {
      description: 'The application blocks lowercase <script> tags but reflects your input otherwise. The filter only checks for the exact string "<script>".',
      vulnerableCode: `function filterInput(input) {
  if (input.includes('<script>')) {
    return 'Blocked!';
  }
  return '<div>' + input + '</div>';
}`,
      context: 'html',
      filterType: 'case-sensitive',
      hint: 'HTML tags are case-insensitive. Try varying the capitalization'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<script', 'alert', '</script'],
      requiredAll: true,
      checkExecution: true,
      customCheck: (payload) => {
        // Must not be lowercase <script>
        return !payload.includes('<script>') && /<[sS][cC][rR][iI][pP][tT]/i.test(payload);
      }
    },
    solution: '<ScRiPt>alert(1)</ScRiPt>',
    explanation: 'HTML is case-insensitive, so <ScRiPt>, <SCRIPT>, or any mixed-case variation works. The filter only blocks exact lowercase <script>, allowing the bypass.'
  },

  'filter-bypass-2': {
    id: 'filter-bypass-2',
    lessonId: 'filter-bypasses',
    title: 'Nested Tag Bypass',
    description: 'Exploit single-pass filter removal',
    difficulty: 'medium',
    type: 'payload-injection',
    points: 20,
    scenario: {
      description: 'The application removes the string "<script>" from your input exactly once, then reflects it. This is a classic single-pass sanitization vulnerability.',
      vulnerableCode: `function sanitize(input) {
  // Remove <script> tag (once)
  return input.replace('<script>', '');
}

function displayContent(input) {
  const clean = sanitize(input);
  document.getElementById('output').innerHTML = clean;
}`,
      context: 'html',
      filterType: 'single-pass removal',
      hint: 'The filter only runs once. What if you nested <script> inside <script>?'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<script', 'alert'],
      requiredAll: true,
      checkExecution: true,
      customCheck: (payload) => {
        // Must contain nested pattern
        return payload.includes('<scr') && payload.includes('ipt>') && (payload.match(/<script/gi) || []).length >= 2;
      }
    },
    solution: '<scr<script>ipt>alert(1)</scr</script>ipt>',
    explanation: 'When the filter removes the inner <script>, it leaves: <script>alert(1)</script>. The payload reconstructs itself after single-pass removal. This demonstrates why filters must loop until no matches remain.'
  },

  'filter-bypass-3': {
    id: 'filter-bypass-3',
    lessonId: 'filter-bypasses',
    title: 'Alternative Event Handler',
    description: 'Use an event handler that isn\'t filtered',
    difficulty: 'medium',
    type: 'payload-injection',
    points: 20,
    scenario: {
      description: 'The application blocks <img> and <script> tags but allows other HTML. Find an alternative way to execute JavaScript.',
      vulnerableCode: `function filterDangerous(input) {
  // Block common XSS vectors
  if (input.includes('<img') || input.includes('<script')) {
    return 'Blocked!';
  }
  return input;
}

function render(input) {
  document.getElementById('content').innerHTML = filterDangerous(input);
}`,
      context: 'html',
      filterType: 'blacklist (<img>, <script>)',
      hint: 'There are many HTML elements that support event handlers: <svg>, <body>, <details>, <marquee>...'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['alert'],
      requiredAll: true,
      checkExecution: true,
      customCheck: (payload) => {
        // Must NOT use <img or <script
        return !payload.includes('<img') && !payload.includes('<script') && /<[a-z]+/i.test(payload);
      }
    },
    solution: '<svg/onload=alert(1)>',
    explanation: 'SVG elements support the onload event handler. Other alternatives include <body onload=alert(1)>, <details open ontoggle=alert(1)>, or <marquee onstart=alert(1)>. Blacklist filters always have gaps.'
  },

  'filter-bypass-4': {
    id: 'filter-bypass-4',
    lessonId: 'filter-bypasses',
    title: 'HTML Entity Encoding',
    description: 'Use HTML entities to bypass string matching',
    difficulty: 'hard',
    type: 'payload-injection',
    points: 25,
    scenario: {
      description: 'The application blocks any input containing the string "alert" but allows HTML tags. The filter checks the raw input string before rendering.',
      vulnerableCode: `function blockAlert(input) {
  if (input.includes('alert')) {
    return 'Nice try! No alerts allowed.';
  }
  return '<div>' + input + '</div>';
}`,
      context: 'html',
      filterType: 'keyword blacklist (alert)',
      hint: 'HTML entities are decoded before JavaScript executes. Can you encode "alert" as entities?'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['<img', 'onerror', '&#'],
      requiredAll: true,
      checkExecution: true,
      customCheck: (payload) => {
        // Must NOT contain literal 'alert'
        return !payload.includes('alert') && payload.includes('&#');
      }
    },
    solution: '<img src=x onerror="&#97;&#108;&#101;&#114;&#116;(1)">',
    explanation: 'HTML entities &#97;&#108;&#101;&#114;&#116; decode to "alert". The filter sees encoded entities, not "alert", so it passes. The browser decodes entities before executing JavaScript: &#97;=a, &#108;=l, &#101;=e, &#114;=r, &#116;=t.'
  },

  // Detection and Prevention challenges
  'detection-prevention-1': {
    id: 'detection-prevention-1',
    lessonId: 'detection-prevention',
    title: 'Safe Output Encoding',
    description: 'Identify the safe method to insert user data',
    difficulty: 'easy',
    type: 'code-review',
    points: 15,
    scenario: {
      description: 'You\'re reviewing code that inserts user input into the page. Which approach is safe from XSS?',
      vulnerableCode: `// Option A:
element.innerHTML = '<p>' + userInput + '</p>';

// Option B:
element.textContent = userInput;

// Option C:
document.write(userInput);

// Option D:
eval('var data = "' + userInput + '"');`,
      context: 'code-review',
      filterType: 'none',
      hint: 'Look for the method that automatically encodes special characters'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['textContent', 'B'],
      requiredAll: false,
      checkExecution: false
    },
    solution: 'B (textContent)',
    explanation: 'textContent automatically encodes special characters as text, making it safe. innerHTML can execute scripts, document.write is dangerous, and eval is extremely dangerous with user input.'
  },

  'detection-prevention-2': {
    id: 'detection-prevention-2',
    lessonId: 'detection-prevention',
    title: 'CSP Implementation',
    description: 'Write a Content Security Policy header to block inline scripts',
    difficulty: 'medium',
    type: 'configuration',
    points: 20,
    scenario: {
      description: 'You need to implement a CSP header that blocks all inline scripts but allows scripts from your own domain (https://example.com). Write the correct CSP directive.',
      vulnerableCode: `<!-- Current page has no CSP -->
<html>
<head>
  <!-- Need CSP header here -->
</head>
<body>
  <script src="https://example.com/app.js"></script>
  <script>alert('inline')</script> <!-- Should be blocked -->
</body>
</html>`,
      context: 'csp',
      filterType: 'none',
      hint: 'CSP uses script-src directive. Use \'self\' for same-origin scripts'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['script-src', 'self'],
      requiredAll: true,
      checkExecution: false
    },
    solution: 'Content-Security-Policy: script-src \'self\'',
    explanation: 'The directive "script-src \'self\'" allows scripts only from the same origin and blocks inline scripts. This prevents XSS payloads with inline <script> tags from executing.'
  },

  'detection-prevention-3': {
    id: 'detection-prevention-3',
    lessonId: 'detection-prevention',
    title: 'Framework Security',
    description: 'Identify the safe React pattern',
    difficulty: 'easy',
    type: 'code-review',
    points: 15,
    scenario: {
      description: 'Which React code safely displays user input without XSS risk?',
      vulnerableCode: `// Option A:
<div dangerouslySetInnerHTML={{__html: userInput}} />

// Option B:
<div>{userInput}</div>

// Option C:
const el = document.createElement('div');
el.innerHTML = userInput;

// Option D:
<div>{eval(userInput)}</div>`,
      context: 'react',
      filterType: 'none',
      hint: 'React automatically escapes values in JSX curly braces'
    },
    validation: {
      type: 'pattern-match',
      patterns: ['B', '{userInput}'],
      requiredAll: false,
      checkExecution: false
    },
    solution: 'B (<div>{userInput}</div>)',
    explanation: 'React automatically escapes values in JSX {curly braces}, making it safe. dangerouslySetInnerHTML bypasses protection, innerHTML is unsafe, and eval is extremely dangerous.'
  }
};
