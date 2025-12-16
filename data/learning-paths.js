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
    estimatedHours: 8,
    prerequisites: [],
    icon: 'book-open',
    color: 'green',
    lessons: ['intro-to-xss', 'basic-payloads', 'html-context']
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
  }
};
