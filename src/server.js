const path = require('path');

// const md5 = require('md5');

const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

const db = require('./server/database.js');
// const request = require('http');

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

server.get('/reservation/:id', (request, response) => {
  var params = [request.params.id]
  console.log(params);
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

/// ///////////////////
// TODO:   input validierung falls post mit postman durchgeführt wird
/// //////////////////

// api calls for room

server.post('/api/rooms', (req, res, next) => {
  console.log(req.body);
  const errors = [];
  if (!req.body.name) {
    errors.push('No name specified');
  }
  if (!req.body.rows) {
    errors.push('No row specified');
  }
  if (!req.body.seatsPerRow) {
    errors.push('No seats per row specified');
  }
  const data = {
    name: req.body.name,
    rows: req.body.rows,
    seatsPerRow: req.body.seatsPerRow
  };
  console.log(data);
  const sql = 'INSERT INTO rooms (name, rows, seatsPerRow) VALUES (?,?,?)';
  const params = [data.name, data.rows, data.seatsPerRow];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

server.get('/api/rooms', (req, res, next) => {
  const sql = 'select * from rooms';
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

server.get('/api/movieDetails/:id', (req, res, next) =>{
  const sql = 'select movies.name, movies.posterName, presentations.timestamp from movies join presentations on movies.movieId = presentations.movieId where movies.movieId = ?'
  let movieId = req.params.id
  console.log(movieId);
  db.get(sql, [movieId], (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message});
      return;
    }
    res.json({
      data: rows
    });
  });
});

server.get('/api/timestamp', (req, res, next) =>{
  const sql = 'select timestamp from presentations join movies on presentations.movieId = movies.movieId where movies.name = "13 Hours"';
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

// api calls for reservations

server.post('/api/reservations', (req, res, next) => {
  console.log(req.body);
  const errors = [];
  if (!req.body.presentationId) {
    errors.push('No row specified');
  }
  if (!req.body.seats) {
    errors.push('No seats per row specified');
  }
  if (!req.body.customer) {
    errors.push('No seats per row specified');
  }
  const data = {
    presentationId: req.body.presentationId,
    seats: req.body.seats,
    customer: req.body.customer
  };
  console.log(data);
  const sql = 'INSERT INTO reservations (presentationId, seats, customer) VALUES (?,?,?)';
  const params = [data.presentationId, data.seats, data.customer];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

server.get('/api/reservations', (req, res, next) => {
  const sql = 'select reservationId, presentationId, seats from Reservierung';
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

// api calls for presentation

server.post('/api/presentations', (req, res, next) => {
  console.log(req.body);
  const errors = [];
  if (!req.body.timestamp) {
    errors.push('No timestamp specified');
  }
  if (!req.body.movieId) {
    errors.push('No movieId specified');
  }
  if (!req.body.roomId) {
    errors.push('No roomId specified');
  }
  const data = {
    timestamp: req.body.timestamp,
    movieId: req.body.movieId,
    roomId: req.body.roomId
  };
  console.log(data);
  const sql = 'INSERT INTO presentations (timestamp, movieId, roomId) VALUES (?,?,?)';
  const params = [data.timestamp, data.movieId, data.roomId];
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID
    });
  });
});

server.get('/api/presentations', (req, res, next) => {
  const sql = 'select * from presentations';
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

// api calls for movies

server.get('/api/movies', (req, res, next) => {
  const sql = 'select * from movies';
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
