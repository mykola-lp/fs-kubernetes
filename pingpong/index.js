const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const filePath = '/usr/src/app/files/counter.txt';

let counter = 0;

if (fs.existsSync(filePath)) {
  counter = parseInt(fs.readFileSync(filePath, 'utf-8')) || 0;
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/pingpong') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`pong ${counter}`);
    counter++;

    fs.writeFileSync(filePath, counter.toString());
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});