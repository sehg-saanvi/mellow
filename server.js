// Lightweight static HTTP server for Mellow local testing
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);

  // API: List files in public directory for inspiration/references
  if (reqPath === '/api/public-images') {
    const publicDir = path.join(__dirname, 'public');
    fs.readdir(publicDir, (err, files) => {
      if (err) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify([]));
        return;
      }
      const imageExts = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif']);
      const images = files.filter(f => imageExts.has(path.extname(f).toLowerCase()));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(images));
    });
    return;
  }

  // API: Save cropped logo
  if (reqPath === '/api/save-cropped-logo' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { dataUrl } = JSON.parse(body);
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path.join(__dirname, 'public', 'mellow-logo-cat.png'), Buffer.from(base64Data, 'base64'));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  const fullPath = path.join(__dirname, reqPath);

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(fullPath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Mellow server running at http://localhost:${PORT}`);
});
