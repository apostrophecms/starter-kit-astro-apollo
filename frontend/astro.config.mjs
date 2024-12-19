import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import apostrophe from '@apostrophecms/apostrophe-astro';
import path from 'path';

// https://astro.build/config
export default defineConfig({
  output: "server",
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 80,
    host: true // Required for Heroku
  },
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [apostrophe({
    aposHost: 'https://apollo-backend-23180cd0fe88.herokuapp.com',
    widgetsMapping: './src/widgets',
    templatesMapping: './src/templates',
    forwardHeaders: [
      'content-security-policy',
      'strict-transport-security',
      'x-frame-options',
      'referrer-policy',
      'cache-control',
      'x-forwarded-for',
      'x-forwarded-proto',
      'x-real-ip',
      'connection',
      'accept',
      'accept-encoding',
      'user-agent'
    ]
  })],
  vite: {
    ssr: {
      // Do not externalize the @apostrophecms/apostrophe-astro plugin, we need
      // to be able to use virtual: URLs there
      noExternal: ['@apostrophecms/apostrophe-astro']
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      }
    }
  }
});