/**
 * XSS filter simulations for educational purposes
 * These demonstrate common (flawed) filtering approaches
 */

export const filters = {
  none: {
    name: 'No Filter',
    description: 'No filtering applied - completely vulnerable',
    apply: (input) => input,
    bypassDifficulty: 'trivial'
  },

  basic: {
    name: 'Basic Filter',
    description: 'Removes <script> tags only',
    apply: (input) => {
      return input.replace(/<script[^>]*>.*?<\/script>/gi, '');
    },
    bypassDifficulty: 'easy',
    commonBypasses: [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<iframe src="javascript:alert(1)">',
    ]
  },

  moderate: {
    name: 'Moderate Filter',
    description: 'Removes <script> tags and event handlers',
    apply: (input) => {
      return input
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/on\w+\s*=/gi, '');
    },
    bypassDifficulty: 'medium',
    commonBypasses: [
      '<svg><animate onbegin=alert(1) attributeName=x>',
      '<iframe src="javascript:alert(1)">',
      '<object data="javascript:alert(1)">',
    ]
  },

  strict: {
    name: 'Strict Filter',
    description: 'Removes all HTML special characters',
    apply: (input) => {
      return input.replace(/[<>"']/g, '');
    },
    bypassDifficulty: 'hard',
    commonBypasses: [
      // Context-dependent - might work in JavaScript context
      'String breaking if inside JS context',
    ]
  },

  blacklist: {
    name: 'Blacklist Filter',
    description: 'Blacklists common XSS keywords',
    apply: (input) => {
      const blacklist = [
        'script', 'javascript', 'onerror', 'onload', 'alert',
        'prompt', 'confirm', 'eval', 'iframe', 'object', 'embed'
      ];

      let filtered = input;
      blacklist.forEach(keyword => {
        const regex = new RegExp(keyword, 'gi');
        filtered = filtered.replace(regex, '');
      });
      return filtered;
    },
    bypassDifficulty: 'medium',
    commonBypasses: [
      '<img src=x onerr<script>or=al<script>ert(1)>',
      '<svg/onload=&Tab;confirm(1)>',
      '<img src=x o&#110;error=alert(1)>',
    ]
  },

  htmlEntities: {
    name: 'HTML Entity Encoder',
    description: 'Encodes HTML entities',
    apply: (input) => {
      return input.replace(/[<>"'&]/g, (char) => {
        const entities = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      });
    },
    bypassDifficulty: 'very hard',
    commonBypasses: [
      'Context-dependent - safe in HTML context',
      'May be vulnerable if output is in JavaScript context'
    ]
  }
};

export const filterOptions = Object.keys(filters).map(key => ({
  value: key,
  label: filters[key].name,
  description: filters[key].description
}));

export const getFilterByName = (name) => {
  return filters[name] || filters.none;
};
