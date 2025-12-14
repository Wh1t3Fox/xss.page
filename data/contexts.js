/**
 * XSS injection contexts for educational purposes
 * These show different places where XSS can occur
 */

export const contexts = {
  html: {
    name: 'HTML Context',
    description: 'Injected directly into HTML body',
    template: (input) => `<div class="output">${input}</div>`,
    example: '<script>alert(1)</script>',
    safetyNote: 'Encode <, >, &, ", and \' characters',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <div class="search-results">
    <h3>Search results for:</h3>
    <div class="output">${input}</div>
  </div>
</body>
</html>`
  },

  attribute: {
    name: 'HTML Attribute',
    description: 'Injected into an HTML attribute value',
    template: (input) => `<input type="text" value="${input}">`,
    example: '" onload="alert(1)',
    safetyNote: 'Encode quotes and use attribute context escaping',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <form>
    <input type="text" value="${input}" placeholder="Search...">
    <button>Search</button>
  </form>
</body>
</html>`
  },

  javascript: {
    name: 'JavaScript Context',
    description: 'Injected into a JavaScript string',
    template: (input) => `<script>var search = '${input}';</script>`,
    example: "'; alert(1); //",
    safetyNote: 'Use JSON.stringify() or proper JavaScript escaping',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <script>
    var userInput = '${input}';
    console.log('User searched for: ' + userInput);
  </script>
</body>
</html>`
  },

  url: {
    name: 'URL/Href Context',
    description: 'Injected into a URL or href attribute',
    template: (input) => `<a href="${input}">Click here</a>`,
    example: 'javascript:alert(1)',
    safetyNote: 'Validate URL scheme, use whitelist of allowed protocols',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <div class="links">
    <a href="${input}">Click here</a>
  </div>
</body>
</html>`
  },

  css: {
    name: 'CSS Context',
    description: 'Injected into CSS style attribute or tag',
    template: (input) => `<div style="background: ${input};">Content</div>`,
    example: 'expression(alert(1))',
    safetyNote: 'Avoid user input in CSS, validate CSS properties',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <div style="background: ${input}; padding: 20px;">
    <p>Styled content</p>
  </div>
</body>
</html>`
  },

  srcAttribute: {
    name: 'Src Attribute',
    description: 'Injected into src attribute (img, script, iframe)',
    template: (input) => `<img src="${input}">`,
    example: 'x" onerror="alert(1)',
    safetyNote: 'Validate URLs, use CSP, check for valid image/resource',
    fullExample: (input) => `
<!DOCTYPE html>
<html>
<body>
  <div class="image-container">
    <img src="${input}" alt="User uploaded image">
  </div>
</body>
</html>`
  }
};

export const contextOptions = Object.keys(contexts).map(key => ({
  value: key,
  label: contexts[key].name,
  description: contexts[key].description
}));

export const getContextByName = (name) => {
  return contexts[name] || contexts.html;
};
