import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-wasm-static-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url ? req.url.split('?')[0] : '';
          if (url.startsWith('/wasm/')) {
            const relPath = url.replace(/^\/wasm\//, '');
            const filePath = path.resolve(__dirname, 'public/wasm', relPath);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              if (filePath.endsWith('.wasm')) {
                res.setHeader('Content-Type', 'application/wasm');
              } else if (filePath.endsWith('.mjs') || filePath.endsWith('.js')) {
                res.setHeader('Content-Type', 'application/javascript');
              }
              res.setHeader('Cache-Control', 'no-cache');
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'onnxruntime-web': path.resolve(__dirname, 'public/vendor/onnxruntime-web.js'),
    },
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'es2022',
  },
});
