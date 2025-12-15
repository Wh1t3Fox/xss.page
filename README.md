# XSS.page

> Comprehensive Cross-Site Scripting (XSS) educational platform with payload database, testing tools, and security resources.

[![Live Site](https://img.shields.io/badge/live-xss.page-blue)](https://xss.page)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

**XSS.page** is a comprehensive educational platform designed for security researchers, penetration testers, and developers to learn about Cross-Site Scripting vulnerabilities. It provides a curated database of 150+ XSS payloads, interactive testing tools, and security analysis utilities.

### Key Features

- **150+ XSS Payloads** - Categorized database covering 27+ attack vectors
- **Static JSON API** - Programmatic access to payload database
- **Interactive Playground** - Safe testing environment for XSS payloads
- **CSP Analyzer** - Parse and analyze Content Security Policy headers
- **DOM Sink/Source Analyzer** - Identify dangerous DOM manipulation patterns
- **Educational Resources** - Comprehensive guides on XSS types and prevention

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (Static Export)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [TailwindCSS 3](https://tailwindcss.com/)
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Wh1t3Fox/xss.page.git
cd xss.page

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Generate static API files and build
npm run build

# Preview production build
npm run export
```

The build process includes:
1. `prebuild` - Generates static JSON API files from payload database
2. `build` - Creates optimized production build
3. Static files exported to `/out` directory

## Project Structure

```
xss.page/
├── components/          # React components
│   ├── shared/         # Reusable UI components
│   ├── Layout.js       # Main layout wrapper
│   ├── Hero.js         # Homepage hero section
│   └── SEO.js          # SEO meta tags
├── data/               # Data files
│   └── payloads.mjs    # XSS payload database (ES module)
├── pages/              # Next.js pages
│   ├── index.js        # Homepage
│   ├── payloads.js     # Payload browser
│   ├── playground.js   # Interactive testing
│   ├── api-docs.js     # API documentation
│   └── tools/          # Security tools
│       ├── csp-analyzer.js
│       ├── dom-analyzer.js
│       └── index.js
├── public/             # Static assets
│   ├── api/           # Generated JSON API files
│   └── _headers       # Cloudflare headers config
├── scripts/            # Build scripts
│   └── generate-api.mjs  # API generation script
├── styles/             # Global styles
└── next.config.js      # Next.js configuration
```

## API Endpoints

All endpoints are static JSON files served from `/api/`:

### Endpoints

| Endpoint | Description | Size |
|----------|-------------|------|
| `/api/payloads.json` | Complete payload database with metadata | ~45KB |
| `/api/categories.json` | Category metadata and counts | ~4KB |
| `/api/payloads-by-category.json` | Payloads organized by category | ~49KB |
| `/api/schema.json` | JSON schema definition | ~2KB |

### CORS Support

All API endpoints include CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Cache-Control: public, max-age=3600`

### Example Usage

**JavaScript**
```javascript
fetch('https://xss.page/api/payloads.json')
  .then(res => res.json())
  .then(data => {
    console.log(`${data.count} payloads loaded`);
    data.payloads.forEach(p => console.log(p.payload));
  });
```

**Python**
```python
import requests

response = requests.get('https://xss.page/api/payloads.json')
data = response.json()

for payload in data['payloads']:
    print(f"{payload['category']}: {payload['payload']}")
```

**cURL**
```bash
curl https://xss.page/api/payloads.json | jq '.payloads[] | select(.severity=="critical")'
```

See `/api-docs` for integration examples with Burp Suite, OWASP ZAP, and more.

## Available Tools

### CSP Analyzer & Builder
- Parse Content Security Policy headers
- Test XSS payloads against CSP rules
- Build secure policies with framework-specific templates
- Visualize policy directives

**Path**: `/tools/csp-analyzer`

### DOM Sink/Source Analyzer
- Scan JavaScript code for dangerous DOM sinks
- Identify untrusted sources
- Visualize data flow from source to sink
- Get remediation advice for vulnerable patterns

**Path**: `/tools/dom-analyzer`

### Interactive Playground
- Safe environment for testing XSS payloads
- Multiple injection contexts (HTML, JavaScript, URL)
- Real-time execution feedback
- No external requests

**Path**: `/playground`

## Payload Categories

The database includes payloads across 27+ categories:

- Basic Script Tags
- Event Handlers
- SVG-based
- HTML5 Tags
- JavaScript Context
- URL Context
- Attribute Context
- Filter Bypasses
- Encoding Tricks
- Polyglots
- DOM-based
- WAF Bypasses
- Mutation-based (mXSS)
- Unicode
- Obfuscation
- Protocol Handlers
- Template Injection
- And more...

## Deployment

The site is configured for static export and deployed on Cloudflare Pages.

### Deploy to Cloudflare Pages

1. Push to GitHub repository
2. Connect repository to Cloudflare Pages
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output**: `out`
   - **Node version**: 18+

The site will automatically rebuild on every push to main.

### Environment Variables

No environment variables required - fully static site.

## Security & Disclaimer

**FOR EDUCATIONAL AND AUTHORIZED TESTING ONLY**

This platform is designed for:
- Security research and education
- Authorized penetration testing
- Security awareness training
- Defensive security implementation

**Important Guidelines:**
- Only test on systems you own or have explicit permission to test
- Unauthorized access to computer systems is illegal
- Use responsibly and ethically
- The authors are not responsible for misuse of this platform

## Contributing

Contributions are welcome! Areas for contribution:

- Additional XSS payloads and vectors
- New security analysis tools
- Documentation improvements
- Bug fixes and optimizations

Please ensure all contributions follow responsible disclosure practices.

## Resources

- [OWASP XSS Guide](https://owasp.org/www-community/attacks/xss/)
- [PortSwigger XSS Cheat Sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [Content Security Policy (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## License

MIT License - See [LICENSE](LICENSE) file for details

---

**Built with ❤️ for the security community**

Report issues: [GitHub Issues](https://github.com/Wh1t3Fox/xss.page/issues)
