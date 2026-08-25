#!/usr/bin/env node
/**
 * TalkWithDad AAC Progressive Web App - Production Static File Server
 * Serves the compiled production bundle from dist/ with proper MIME types, CORS, and SPA fallback.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

const PORT = parseInt(process.env.PORT || process.argv[2] || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.webm': 'audio/webm',
  '.onnx': 'application/octet-stream',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

if (!fs.existsSync(distDir)) {
  console.error(`❌ Distribution directory not found: ${distDir}`);
  console.error('Please run `npm run build` first before starting the server.\n');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS, Cross-Origin Isolation & caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cache-Control', 'no-cache');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  const urlPath = req.url ? req.url.split('?')[0] : '/';
  const decodedPath = decodeURIComponent(urlPath);
  let safePath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(distDir, safePath);

  // If path is directory or root, serve index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // SPA fallback: if file does not exist and has no file extension, fallback to index.html
  if (!fs.existsSync(filePath)) {
    if (!path.extname(safePath)) {
      filePath = path.join(distDir, 'index.html');
    }
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end(`404 Not Found: ${urlPath}`);
    return;
  }

  try {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`500 Internal Server Error: ${err.message}`);
  }
});

server.listen(PORT, HOST, () => {
  console.log('================================================================');
  console.log('    TALKWITHDAD AAC PROGRESSIVE WEB APP - PRODUCTION SERVER     ');
  console.log('================================================================');
  console.log(`\n  ✔ Serving directory: ${distDir}`);
  console.log(`  ✔ Local:            http://localhost:${PORT}`);
  console.log(`  ✔ Network / Host:   http://${HOST}:${PORT}`);
  console.log('\nPress Ctrl+C to stop the server.\n');
});
