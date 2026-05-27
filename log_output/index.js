const crypto = require('crypto');

const randomString = crypto.randomUUID();

const printLogLine = () => {
  console.log(`${new Date().toISOString()}: ${randomString}`);
};

printLogLine();
setInterval(printLogLine, 5000);
