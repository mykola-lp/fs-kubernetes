const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL;
const WIKI_URL = process.env.WIKI_URL || 'https://en.wikipedia.org/wiki/Special:Random';

function getRandomArticleUrl() {
  return new Promise((resolve, reject) => {
    https.get(WIKI_URL, (res) => {
      if (
        res.statusCode >= 300 &&
        res.statusCode < 400 &&
        res.headers.location
      ) {
        resolve(res.headers.location);
        res.resume();
        return;
      }

      reject(new Error(`Unexpected response from Wikipedia: ${res.statusCode}`));
    }).on('error', reject);
  });
}

function postTodo(content) {
  return new Promise((resolve, reject) => {
    const postData = `content=${encodeURIComponent(content)}`;
    const url = new URL(BACKEND_URL);

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(data);
          return;
        }

        reject(new Error(`Backend responded ${res.statusCode}: ${data}`));
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

(async () => {
  try {
    const articleUrl = await getRandomArticleUrl();
    console.log(`Got random article: ${articleUrl}`);

    await postTodo(`Read ${articleUrl}`);
    console.log('Reminder todo created successfully');

    process.exit(0);
  } catch (err) {
    console.error('Failed to create reminder todo:', err);
    process.exit(1);
  }
})();
