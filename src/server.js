const path = require('path');

const express = require('express');
const server = express();

const db = require('./server/database.js');

const hostname = 'localhost';

let port = 8080;

// Static Files
server.use(express.static('build'));

server.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, './views/selection.html'));
});

server.get('/index_user', (request, response) => {
  response.sendFile(path.join(__dirname, './views/user/index_user.html'));
});

server.get('/index_admin', (request, response) => {
  response.sendFile(path.join(__dirname, './views/admin/index_admin.html'));
});

server.get('/reservation', (request, response) => {
  response.sendFile(path.join(__dirname, './views/user/reservation.html'));
});

server.get('/create_presentation', (request, response) => {
  response.sendFile(path.join(__dirname, './views/admin/create_presentation.html'));
});

server.get('/create_room', (request, response) => {
  response.sendFile(path.join(__dirname, './views/admin/create_room.html'));
});

if (process.argv[2] !== undefined) {
  port = process.argv[2];
}

try {
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
} catch (err) {
  console.log('invalid port');
}

server.get('/api/users', (req, res, next) => {
  const sql = 'select * from Reservierung';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

server.get('/api/user', (req, res, next) => {
  const sql = 'select * from Vorstellung';
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});
