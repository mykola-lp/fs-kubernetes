const http = require('http');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3000;
const randomString = randomUUID();

setInterval(() => {
  console.log(`${new Date().toISOString()}: ${randomString}`);
}, 5000);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`${new Date().toISOString()}: ${randomString}`);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});