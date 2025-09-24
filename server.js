#!/usr/bin/env node

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

async function serveFile(filePath, res) {
  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      throw new Error('Not a file');
    }

    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    const content = await readFile(filePath);

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': content.length,
      'Cache-Control': 'public, max-age=3600'
    });

    res.end(content);
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
  }
}

const server = createServer(async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  let urlPath = req.url.split('?')[0];

  // Default to index.html for root
  if (urlPath === '/') {
    urlPath = '/index.html';
  }

  const filePath = join(__dirname, 'docs', urlPath.slice(1));

  console.log(`${new Date().toISOString()} - ${req.method} ${urlPath}`);

  await serveFile(filePath, res);
});

server.listen(PORT, () => {
  console.log(`\n🎮 Flag Game Server started!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\nPress Ctrl+C to stop the server\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});