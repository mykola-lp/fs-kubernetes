const http = require('http');
const https = require('https');

const fs = require('fs');

const PORT = process.env.PORT || 3000;

const imagePath = '/usr/src/app/files/image.jpg';
const metaPath = '/usr/src/app/files/image-meta.json';

const CACHE_MINUTES = Number(process.env.CACHE_MINUTES);
const BACKEND_URL = process.env.BACKEND_URL;
const IMAGE_URL = process.env.IMAGE_URL;

function renderHtml(todos) {
  const todoItems = todos.map((t) => `<li>${t.content}</li>`).join('\n');

  return `
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

        <form class="todo-form" action="/todos" method="post">
          <input
            type="text"
            id="todo-input"
            name="content"
            maxlength="140"
            placeholder="Enter a new todo (max 140 characters)"
          >

          <button type="submit" id="send-button">Send</button>
        </form>

        <h2>Todos</h2>

        <ul class="todo-list">
          ${todoItems}
        </ul>
      </body>
    </html>
  `;
}

function downloadImage(callback) {
  https.get(IMAGE_URL, (res) => {
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

function getTodos() {
  return new Promise((resolve) => {
    http.get(BACKEND_URL, (res) => {
      let data = '';

      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', () => resolve([]));
  });
}

function postTodo(content) {
  return new Promise((resolve) => {
    const postData = `content=${encodeURIComponent(content)}`;

    const url = new URL(BACKEND_URL);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      res.on('data', () => {});
      res.on('end', () => resolve());
    });

    req.write(postData);
    req.end();
  });
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  if (
    req.method === 'GET' &&
    req.url === '/'
  ) {
    const todos = await getTodos();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderHtml(todos));
    return;
  }

  if (
    req.method === 'POST' &&
    req.url === '/todos'
  ) {
    const body = await getBody(req);
    const params = new URLSearchParams(body);

    await postTodo(params.get('content'));

    res.writeHead(302, { Location: '/' });
    res.end();
    return;
  }

  if (
    req.method === 'GET' &&
    req.url === '/image'
  ) {
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
