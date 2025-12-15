#!/usr/bin/env node

/**
 * Static API Generator for XSS.page
 * Generates static JSON files from payload data for programmatic access
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import payload data
import { payloads } from '../data/payloads.mjs';
import { generateMutations } from '../utils/payload-fuzzer.mjs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_DIR = path.join(__dirname, '../public/api');
const API_VERSION = '1.0';

/**
 * Ensure API directory exists
 */
function ensureApiDirectory() {
  if (!fs.existsSync(API_DIR)) {
    fs.mkdirSync(API_DIR, { recursive: true });
    console.log('✓ Created /public/api/ directory');
  }
}

/**
 * Get category display name from category ID
 */
function getCategoryDisplayName(categoryId) {
  const categoryNames = {
    'basic': 'Basic',
    'event-handler': 'Event Handlers',
    'svg': 'SVG-based',
    'html5': 'HTML5 Tags',
    'javascript-context': 'JavaScript Context',
    'url-context': 'URL Context',
    'attribute-context': 'Attribute Context',
    'filter-bypass': 'Filter Bypasses',
    'encoding': 'Encoding Tricks',
    'polyglot': 'Polyglots',
    'dom-based': 'DOM-based',
    'waf-bypass': 'WAF Bypasses',
    'advanced': 'Advanced',
    'modern': 'Modern',
    'css-style': 'Style/CSS',
    'framework-specific': 'Framework-Specific',
    'xml-based': 'XML-based',
    'data-uri': 'Data URI',
    'template-injection': 'Template Injection',
    'prototype-pollution': 'Prototype Pollution',
    'mutation': 'Mutation-based',
    'unicode': 'Unicode',
    'obfuscation': 'Obfuscation',
    'protocol-handler': 'Protocol Handlers',
    'markdown': 'Markdown',
    'jsonp': 'JSONP',
    'regex-bypass': 'Regex Bypass',
    'timing-based': 'Timing-based'
  };

  return categoryNames[categoryId] || categoryId;
}

/**
 * Get category description
 */
function getCategoryDescription(categoryId) {
  const descriptions = {
    'basic': 'Classic XSS payloads using script tags and basic injection techniques',
    'event-handler': 'XSS through HTML event handlers like onclick, onerror, onload',
    'svg': 'SVG-based XSS vectors using inline SVG elements',
    'html5': 'Modern HTML5 tag-based XSS techniques',
    'javascript-context': 'Payloads designed for JavaScript context injection',
    'url-context': 'XSS vectors for URL and href context',
    'attribute-context': 'HTML attribute-based XSS exploitation',
    'filter-bypass': 'Techniques to bypass common XSS filters and sanitizers',
    'encoding': 'Encoding-based bypass techniques (HTML entities, URL encoding, etc.)',
    'polyglot': 'Universal payloads that work in multiple contexts',
    'dom-based': 'DOM-based XSS exploitation techniques',
    'waf-bypass': 'Payloads designed to bypass Web Application Firewalls',
    'advanced': 'Advanced and sophisticated XSS techniques',
    'modern': 'Modern browser-specific XSS vectors',
    'css-style': 'CSS and style-based XSS injection',
    'framework-specific': 'Framework-specific XSS vulnerabilities (React, Angular, Vue)',
    'xml-based': 'XML and XSLT-based XSS vectors',
    'data-uri': 'Data URI scheme XSS exploitation',
    'template-injection': 'Template engine injection techniques',
    'prototype-pollution': 'Prototype pollution-based XSS',
    'mutation': 'Mutation-based XSS using mXSS techniques',
    'unicode': 'Unicode-based XSS bypass techniques',
    'obfuscation': 'Obfuscated and encoded XSS payloads',
    'protocol-handler': 'Protocol handler-based XSS (javascript:, data:, etc.)',
    'markdown': 'Markdown parser XSS vulnerabilities',
    'jsonp': 'JSONP-based XSS exploitation',
    'regex-bypass': 'Regular expression bypass techniques',
    'timing-based': 'Timing-based XSS and side-channel attacks'
  };

  return descriptions[categoryId] || 'XSS payload category';
}

/**
 * Generate payloads.json - All payloads with metadata
 */
function generatePayloadsJSON() {
  const data = {
    version: API_VERSION,
    count: payloads.length,
    generated: new Date().toISOString(),
    payloads: payloads
  };

  const filePath = path.join(API_DIR, 'payloads.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Generated payloads.json (${payloads.length} payloads)`);
}

/**
 * Generate payloads-by-category.json - Organized by category
 */
function generatePayloadsByCategoryJSON() {
  const categories = {};

  payloads.forEach(payload => {
    const category = payload.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(payload);
  });

  const data = {
    version: API_VERSION,
    generated: new Date().toISOString(),
    categoryCount: Object.keys(categories).length,
    categories: categories
  };

  const filePath = path.join(API_DIR, 'payloads-by-category.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Generated payloads-by-category.json (${Object.keys(categories).length} categories)`);
}

/**
 * Generate categories.json - Category metadata
 */
function generateCategoriesJSON() {
  const categoryCounts = {};

  payloads.forEach(payload => {
    const category = payload.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const categoriesArray = Object.keys(categoryCounts).map(categoryId => ({
    id: categoryId,
    name: getCategoryDisplayName(categoryId),
    count: categoryCounts[categoryId],
    description: getCategoryDescription(categoryId)
  }));

  const data = {
    version: API_VERSION,
    generated: new Date().toISOString(),
    total: categoriesArray.length,
    categories: categoriesArray
  };

  const filePath = path.join(API_DIR, 'categories.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Generated categories.json (${categoriesArray.length} categories)`);
}

/**
 * Generate schema.json - Payload structure definition
 */
function generateSchemaJSON() {
  const schema = {
    version: API_VERSION,
    generated: new Date().toISOString(),
    schema: {
      type: 'object',
      required: ['id', 'payload', 'category', 'technique', 'context', 'description', 'severity', 'browsers'],
      properties: {
        id: {
          type: 'number',
          description: 'Unique identifier for the payload'
        },
        payload: {
          type: 'string',
          description: 'The actual XSS payload string'
        },
        category: {
          type: 'string',
          description: 'Category of the XSS technique (e.g., basic, event-handler, svg)',
          examples: ['basic', 'event-handler', 'svg', 'filter-bypass']
        },
        technique: {
          type: 'string',
          description: 'Specific technique used in the payload'
        },
        context: {
          type: 'string',
          description: 'Context where the payload is effective',
          enum: ['html', 'javascript', 'url', 'attribute', 'xml', 'dom', 'css', 'json']
        },
        description: {
          type: 'string',
          description: 'Explanation of how the payload works'
        },
        severity: {
          type: 'string',
          description: 'Severity level of the vulnerability',
          enum: ['critical', 'high', 'medium', 'low']
        },
        browsers: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Compatible browsers for this payload',
          examples: [['chrome', 'firefox', 'safari'], ['all']]
        }
      }
    },
    example: payloads[0] || null
  };

  const filePath = path.join(API_DIR, 'schema.json');
  fs.writeFileSync(filePath, JSON.stringify(schema, null, 2));
  console.log('✓ Generated schema.json');
}

/**
 * Generate fuzzer-mutations.json - Pre-generated payload mutations
 */
function generateFuzzerMutationsJSON() {
  // Base payloads to fuzz
  const basePayloads = [
    { base: '<script>alert(1)</script>', category: 'basic' },
    { base: '<img src=x onerror=alert(1)>', category: 'event-handler' },
    { base: '<svg/onload=alert(1)>', category: 'svg' },
    { base: 'javascript:alert(1)', category: 'protocol-handler' },
    { base: '<iframe src="javascript:alert(1)">', category: 'iframe' },
    { base: '<input onfocus=alert(1) autofocus>', category: 'input-event' },
    { base: '<body onload=alert(1)>', category: 'body-event' },
    { base: '<details open ontoggle=alert(1)>', category: 'html5' },
    { base: "'-alert(1)-'", category: 'javascript-context' },
    { base: '"onload=alert(1)//', category: 'attribute-context' }
  ];

  // Apply all mutation strategies
  const allStrategies = {
    htmlEntities: true,
    urlEncoding: true,
    unicodeEscapes: true,
    base64: true,
    caseVariations: true,
    quoteSubstitution: true,
    whitespaceVariation: true,
    nullBytes: true,
    comments: true,
    protocolVariation: true,
    obfuscation: true
  };

  const mutatedPayloads = basePayloads.map(item => {
    const result = generateMutations(item.base, allStrategies);
    return {
      base: item.base,
      category: item.category,
      mutations: result.mutations,
      mutationCount: result.total
    };
  });

  const totalMutations = mutatedPayloads.reduce((sum, item) => sum + item.mutationCount, 0);

  const data = {
    version: API_VERSION,
    generated: new Date().toISOString(),
    basePayloads: mutatedPayloads,
    totalBasePayloads: basePayloads.length,
    totalMutations: totalMutations,
    strategies: Object.keys(allStrategies)
  };

  const filePath = path.join(API_DIR, 'fuzzer-mutations.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ Generated fuzzer-mutations.json (${totalMutations} mutations from ${basePayloads.length} base payloads)`);
}

/**
 * Main execution
 */
function main() {
  console.log('\n🚀 Generating Static API Files...\n');

  try {
    ensureApiDirectory();
    generatePayloadsJSON();
    generatePayloadsByCategoryJSON();
    generateCategoriesJSON();
    generateSchemaJSON();
    generateFuzzerMutationsJSON();

    console.log('\n✅ API generation complete!\n');
    console.log('Generated files:');
    console.log('  - /public/api/payloads.json');
    console.log('  - /public/api/payloads-by-category.json');
    console.log('  - /public/api/categories.json');
    console.log('  - /public/api/schema.json');
    console.log('  - /public/api/fuzzer-mutations.json\n');
  } catch (error) {
    console.error('\n❌ Error generating API files:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
