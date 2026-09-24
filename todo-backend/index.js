const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function initDb(retries = 30) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(
        'CREATE TABLE IF NOT EXISTS todos (id SERIAL PRIMARY KEY, content VARCHAR(140) NOT NULL)'
      );
      console.log('Database is ready');
      return;
    } catch (err) {
      console.log(`DB not ready (attempt ${i}/${retries}): ${err.message}`);
      await sleep(2000);
    }
  }
  throw new Error('Could not connect to the database');
}

function getBody(req) {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body));
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (
      req.method === 'GET' &&
      req.url === '/todos'
    ) {
      const { rows } = await pool.query('SELECT id, content FROM todos ORDER BY id');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows));
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

      const { rows } = await pool.query(
        'INSERT INTO todos (content) VALUES ($1) RETURNING id, content',
        [content]
      );

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(rows[0]));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  } catch (err) {
    console.error(err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Database error');
  }
});

initDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started in port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });