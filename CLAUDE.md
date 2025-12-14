# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a public documentation website for Cross-Site Scripting (XSS) vulnerabilities, built with Next.js. The site provides comprehensive examples, testing methodologies, and educational resources for finding and understanding XSS vulnerabilities. It is hosted on GitHub and served via Cloudflare Pages.

## Development Commands

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Export static site (runs build first)
npm run export

# Start production server (runs export first, serves from /out)
npm start
```

## Architecture

### Framework: Next.js Static Export

This project uses Next.js configured for static site generation. The build process:
1. `npm run build` - Next.js builds the application
2. `npm run export` - Exports static HTML files to `/out` directory
3. `npm start` - Uses `serve` package to host the static files from `/out` (local development)

### Deployment Architecture

- **Hosting**: GitHub repository
- **CDN/Serving**: Cloudflare Pages serves the static Next.js export
- **Build Output**: Static HTML/JS/CSS files exported to `/out` directory

### Page Structure

- **pages/index.js** - Homepage (currently empty div)
- **pages/post/[id].js** - Dynamic route for individual posts
  - Fetches posts from `jsonplaceholder.typicode.com` API at build time
  - Uses `getStaticPaths()` to pre-render pages for posts 1-10 (first page)
  - Uses `getStaticProps()` to fetch individual post data
  - Renders title, body, and back link

### Components

- **components/post.js** - Post preview component
  - Takes `title`, `body`, and `id` as props
  - Renders article with link to full post page

### Custom Agent

The repository includes a custom Claude Code agent:
- **.claude/agents/xss-security-tester.md** - Specialized agent for XSS vulnerability analysis
  - Use when analyzing code for XSS vulnerabilities
  - Use when creating XSS test payloads
  - Use when reviewing user input handling and sanitization

## Project Context

This is a public educational resource focused on XSS vulnerabilities. When working with this codebase:

1. **Purpose**: Public documentation providing comprehensive XSS examples, testing techniques, and vulnerability discovery methods
2. **Audience**: Security researchers, penetration testers, and developers learning about XSS
3. **Content Focus**: Educational examples and demonstrations of XSS vulnerabilities and testing methodologies
4. **External API**: Currently uses JSONPlaceholder API for sample content during static generation
5. **React Safety**: Note that Next.js/React provides automatic XSS protection through JSX escaping by default - intentional vulnerabilities for demonstration purposes may require specific techniques to bypass this protection
