const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const statusPath = '/usr/src/app/files/status.log';
const counterPath = '/usr/src/app/shared/counter.txt';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const status = fs.existsSync(statusPath)
      ? fs.readFileSync(statusPath, 'utf-8').trim()
      : 'No data yet';

    const pongs = fs.existsSync(counterPath)
      ? fs.readFileSync(counterPath, 'utf-8').trim()
      : '0';

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`${status}.\nPing / Pongs: ${pongs}`);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`Reader started in port ${PORT}`);
});