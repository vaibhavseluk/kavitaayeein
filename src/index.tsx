import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import type { Env } from './lib/types';

// Import e-commerce routes
import auth from './routes/ecommerce/auth';
import translations from './routes/ecommerce/translations';
import credits from './routes/ecommerce/credits';
import glossary from './routes/ecommerce/glossary';
import admin from './routes/ecommerce/admin';
import knowledge from './routes/ecommerce/knowledge';
import refunds from './routes/ecommerce/refunds';
import pages from './routes/ecommerce/pages';
import settings from './routes/settings';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('/api/*', cors());

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }));

// Mount API routes
app.route('/api/auth', auth);
app.route('/api/admin', admin);
app.route('/api/translations', translations);
app.route('/api/credits', credits);
app.route('/api/glossary', glossary);
app.route('/api/knowledge', knowledge);
app.route('/api/refunds', refunds);
app.route('/api/settings', settings);

// Health check (define before pages router)
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'shabdly-ecommerce-translation',
    timestamp: new Date().toISOString() 
  });
});

// Dashboard page (protected, requires auth) - MUST be before pages router
app.get('/dashboard', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/dashboard.js" defer></script>
    </head>
    <body class="bg-gray-50">
        <div id="dashboard-root"></div>
    </body>
    </html>
  `);
});

// Settings page (protected, requires auth) - MUST be before pages router
app.get('/settings', (c) => {  
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Settings - Shabdly</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/global.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/settings.js" defer></script>
        <script>
          window.PLATFORM = 'shabdly';
        </script>
    </head>
    <body class="bg-gray-50">
        <div id="settings-root"></div>
    </body>
    </html>
  `);
});

// Mount pages routes (catch-all, must be AFTER specific routes)
app.route('/', pages);

// Homepage - E-commerce Translation Platform
app.get('/', (c) => {
  // Redirect homepage to dashboard (main e-commerce interface)
  return c.redirect('/dashboard');
});

export default app;

