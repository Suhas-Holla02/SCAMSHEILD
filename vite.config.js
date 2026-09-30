import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function apiDevPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }

        try {
          const url = new URL(req.url, `http://${req.headers.host || 'localhost:5173'}`);
          const routeName = url.pathname.replace(/^\/api\/?/, '').replace(/\/$/, '');
          const filePath = path.resolve(__dirname, 'api', `${routeName}.js`);

          if (!fs.existsSync(filePath)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: `API route ${url.pathname} not found` }));
          }

          // Parse query parameters
          req.query = Object.fromEntries(url.searchParams.entries());

          // Parse request body for POST/PUT/DELETE
          if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            const chunks = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const rawBody = Buffer.concat(chunks).toString('utf8');
            try {
              req.body = rawBody ? JSON.parse(rawBody) : {};
            } catch {
              req.body = rawBody;
            }
          } else {
            req.body = {};
          }

          // Helper response methods matching Vercel Serverless Function signature
          res.status = function (statusCode) {
            res.statusCode = statusCode;
            return res;
          };

          res.json = function (data) {
            if (!res.headersSent) {
              res.setHeader('Content-Type', 'application/json');
            }
            res.end(JSON.stringify(data));
            return res;
          };

          // Load and execute the API handler using Vite's SSR module loader
          const module = await server.ssrLoadModule(filePath);
          const handler = module.default || module;
          await handler(req, res);
        } catch (error) {
          console.error(`[API Dev Error] ${req.url}:`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
          }
        }
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables from .env into process.env for local API routes
  const env = loadEnv(mode, process.cwd(), '');
  for (const [key, val] of Object.entries(env)) {
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }

  return {
    plugins: [react(), apiDevPlugin()],
    build: {
      outDir: 'dist',
      sourcemap: false
    }
  };
});
