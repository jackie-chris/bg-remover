const http = require('http');
const fs = require('fs');
const path = require('path');

const REMOVEBG_API_KEY = 'JZAnk6Jc43q8HJwV4E2J94Bg';
const PORT = 8787;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Serve index.html for root
  if (req.url === '/' || req.url === '/index.html') {
    const html = fs.readFileSync(path.join(__dirname, 'public/index.html'));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // Handle API request
  if (req.url === '/api/remove-bg' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { image } = JSON.parse(body);
        
        if (!image) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'NO_IMAGE', message: '未提供图片' }));
          return;
        }

        // Call Remove.bg API
        const formData = new URLSearchParams();
        formData.append('image_file_b64', image);
        formData.append('size', 'auto');

        const apiRes = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': REMOVEBG_API_KEY
          },
          body: formData
        });

        if (!apiRes.ok) {
          const errorText = await apiRes.text();
          console.error('Remove.bg error:', errorText);
          
          if (apiRes.status === 402 || apiRes.status === 403) {
            res.writeHead(429, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'QUOTA_EXCEEDED', message: 'API 额度已用尽' }));
            return;
          }
          
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'API_ERROR', message: '背景移除服务暂时不可用' }));
          return;
        }

        // Return PNG image
        const imageBuffer = await apiRes.arrayBuffer();
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(Buffer.from(imageBuffer));
        
      } catch (error) {
        console.error('Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'INTERNAL_ERROR', message: error.message }));
      }
    });
    return;
  }

  // 404 for other routes
  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
  console.log(`📱 Access from: http://170.106.107.102:${PORT}`);
});
