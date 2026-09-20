const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const filePath = '/usr/src/app/files/status.log';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    let content = 'No data yet';
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath, 'utf-8');
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(content);
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Reader started in port ${PORT}`);
});