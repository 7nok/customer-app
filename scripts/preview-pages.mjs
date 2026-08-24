#!/usr/bin/env node
/**
 * Serve the Expo static export the way GitHub Pages will:
 * https://7nok.github.io/joes-app/  →  http://localhost:4173/joes-app/
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PREFIX = '/joes-app';
const PORT = Number(process.env.PORT || 4173);
const DIST = resolve(fileURLToPath(new URL('..', import.meta.url)), 'dist');

const TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.map': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

function safeFile(urlPath) {
  const relative = urlPath.startsWith(PREFIX) ? urlPath.slice(PREFIX.length) : urlPath;
  const candidate = normalize(join(DIST, relative));
  if (!candidate.startsWith(DIST)) {
    return null;
  }
  return candidate;
}

function resolveFile(urlPath) {
  let file = safeFile(urlPath);
  if (!file) {
    return null;
  }
  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, 'index.html');
  }
  if (!existsSync(file) && existsSync(`${file}.html`)) {
    file = `${file}.html`;
  }
  if (!existsSync(file)) {
    const fallback404 = join(DIST, '404.html');
    const fallbackIndex = join(DIST, 'index.html');
    return existsSync(fallback404) ? fallback404 : fallbackIndex;
  }
  return file;
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);

  if (url === '/' || url === PREFIX) {
    res.writeHead(302, { Location: `${PREFIX}/` });
    res.end();
    return;
  }

  const file = resolveFile(url === `${PREFIX}/` ? `${PREFIX}/index.html` : url);
  if (!file || !existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found. Run npm run export:web first.');
    return;
  }

  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Pages preview: http://localhost:${PORT}${PREFIX}/`);
});
