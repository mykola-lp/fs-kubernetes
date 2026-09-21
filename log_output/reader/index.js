const http = require('http');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const statusPath = '/usr/src/app/files/status.log';

function getPingsCount() {
  return new Promise((resolve) => {
    http.get('http://pingpong-svc:2347/pings', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => resolve('0'));
  });
}

const server = http.createServer(async (req, res) => {
  if (
    req.method === 'GET' &&
    (
      req.url === '/' ||
      req.url === '/status'
    )
  ) {
    const status = fs.existsSync(statusPath)
      ? fs.readFileSync(statusPath, 'utf-8').trim()
      : 'No data yet';

    const pongs = await getPingsCount();

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
