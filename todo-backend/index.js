const http = require('http');

const PORT = process.env.PORT || 3000;

let todos = [
  { id: 1, content: 'Learn Kubernetes basics' },
  { id: 2, content: 'Deploy application to cluster' },
  { id: 3, content: 'Configure persistent volumes' }
];

let nextId = 4;

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
    req.url === '/todos'
  ) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(todos));
    return;
  }

  if (
    req.method === 'POST' &&
    req.url === '/todos'
  ) {
    const body = await getBody(req);
    const params = new URLSearchParams(body);
    const content = params.get('content');

    if (!content || content.length > 140) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid todo content');
      return;
    }

    const newTodo = { id: nextId++, content };
    todos.push(newTodo);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newTodo));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});