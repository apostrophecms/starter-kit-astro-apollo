// locale-config.js
// Configuration for multi-locale static site generation
//
// Each locale needs:
//   - baseUrl: The full URL where this locale will be hosted
//   - prefix: The URL prefix for this locale (optional, defaults to '')
//
// The prefix should match your Apostrophe locale configuration

export default {
  en: {
    baseUrl: 'http://localhost:3000',
    prefix: '' // English is at the root with no prefix
  },
  fr: {
    baseUrl: 'http://localhost:3000',
    prefix: '/fr'
  },
  es: {
    baseUrl: 'http://localhost:3000',
    prefix: '/es'
  },
  de: {
    baseUrl: 'http://localhost:3000',
    prefix: '/de'
  }
};