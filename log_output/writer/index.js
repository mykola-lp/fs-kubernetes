const fs = require('fs');
const { randomUUID } = require('crypto');

const randomString = randomUUID();
const filePath = '/usr/src/app/files/status.log';

setInterval(() => {
  const line = `${new Date().toISOString()}: ${randomString}\n`;
  fs.writeFileSync(filePath, line);
}, 5000);

console.log('Writer started');