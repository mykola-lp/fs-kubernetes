const http = require('http');
const https = require('https');

const fs = require('fs');

const PORT = process.env.PORT || 3000;

const imagePath = '/usr/src/app/files/image.jpg';
const metaPath = '/usr/src/app/files/image-meta.json';

const CACHE_MINUTES = 10;

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Todo App</title>

  <style>
    body {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
      margin: 0;
      color: #333;
    }

    h1 {
      text-align: center;
    }
    
    h2 {
      width: 100%;
      max-width: 600px;
      text-align: center;
    }

    img {
      max-width: 90vw;
      width: 400px;
      border: 6px solid #e0e0e0;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      margin-bottom: 2rem;
    }

    .todo-form {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      max-width: 600px;
      margin-bottom: 2rem;
    }

    .todo-form input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 2px solid #4caf50;
      border-radius: 8px;
      font-size: 1rem;
    }

    .todo-form button {
      padding: 0.75rem 1.5rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
    }

    .todo-form button:hover {
      background: #43a047;
    }

    .todo-list {
      width: 100%;
      max-width: 600px;
      list-style: none;
      padding: 0;
    }

    .todo-list li {
      background: #f5f5f5;
      border-left: 4px solid #4caf50;
      padding: 1rem;
      margin-bottom: 0.75rem;
      border-radius: 4px;
    }

    @media (max-width: 600px) {
      img { width: 100%; }
    }
  </style>
</head>
<body>
  <h1>Todo App</h1>

  <img src="/image" alt="Random image">

  <form class="todo-form" onsubmit="return false;">
    <input type="text" id="todo-input" maxlength="140" placeholder="Enter a new todo (max 140 characters)">
    <button type="submit" id="send-button">Send</button>
  </form>

  <h2>Todos</h2>

  <ul class="todo-list">
    <li>Learn Kubernetes basics</li>
    <li>Deploy application to cluster</li>
    <li>Configure persistent volumes</li>
  </ul>
</body>
</html>
`;

function downloadImage(callback) {
  https.get('https://picsum.photos/1200', (res) => {
    if (
      res.statusCode >= 300 &&
      res.statusCode < 400 &&
      res.headers.location
    ) {
      https.get(res.headers.location, (redirected) => {
        const file = fs.createWriteStream(imagePath);
        redirected.pipe(file);

        file.on('finish', () => {
          file.close();
          fs.writeFileSync(metaPath, JSON.stringify({ fetchedAt: Date.now() }));
          callback();
        });
      });

      return;
    }

    const file = fs.createWriteStream(imagePath);
    res.pipe(file);

    file.on('finish', () => {
      file.close();
      fs.writeFileSync(metaPath, JSON.stringify({ fetchedAt: Date.now() }));
      callback();
    });
  }).on('error', (err) => console.error('Image download failed:', err));
}

function isStale() {
  if (!fs.existsSync(metaPath)) return true;
  const { fetchedAt } = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  return Date.now() - fetchedAt > CACHE_MINUTES * 60 * 1000;
}

if (!fs.existsSync(imagePath)) {
  downloadImage(() => console.log('Initial image downloaded'));
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  if (req.method === 'GET' && req.url === '/image') {
    if (isStale()) {
      downloadImage(() => console.log('Image refreshed in background'));
    }

    if (fs.existsSync(imagePath)) {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      fs.createReadStream(imagePath).pipe(res);
      return;
    }

    res.writeHead(503, { 'Content-Type': 'text/plain' });
    res.end('Image not ready yet');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received: container is shutting down');
  console.log(`Last known image cache state: ${fs.existsSync(imagePath) ? 'image present on volume' : 'no image cached yet'}`);

  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
});