const http = require('http');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'postgres-svc',
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
        'CREATE TABLE IF NOT EXISTS counters (id INT PRIMARY KEY, value INT NOT NULL)'
      );
      await pool.query(
        'INSERT INTO counters (id, value) VALUES (1, 0) ON CONFLICT (id) DO NOTHING'
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

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'text/plain' });
  res.end(body);
};

const server = http.createServer(async (req, res) => {
  try {
    if (
      req.method === 'GET' &&
      req.url === '/pingpong'
    ) {
      const { rows } = await pool.query(
        'UPDATE counters SET value = value + 1 WHERE id = 1 RETURNING value'
      );
      return send(res, 200, `pong ${rows[0].value - 1}`);
    }

    if (
      req.method === 'GET' &&
      req.url === '/pings'
    ) {
      const { rows } = await pool.query('SELECT value FROM counters WHERE id = 1');
      return send(res, 200, rows[0].value.toString());
    }

    return send(res, 404, 'Not found');
  } catch (err) {
    console.error(err);
    return send(res, 500, 'Database error');
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