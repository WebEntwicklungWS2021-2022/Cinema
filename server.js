const express = require('express');
const server = express();

let port = 8080;

const args = process.argv.slice(2);
if (args.length > 0) {
  const p = parseInt(args[0]);
  if (!isNaN(p)) {
    if (p >= 0 && p <= 65535) {
      port = p;
      console.log('using port ' + p);
    } else {
      console.log('usage: main.js <optional port, otherwise 8080>');
      console.log('using port 8080 instead');
    }
  } else {
    console.log('usage: main.js <optional port, otherwise 8080>');
    console.log('using port 8080 instead');
  }
}

server.use(express.static('./client/src'));

server.listen(port);
