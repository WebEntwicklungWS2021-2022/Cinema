/* const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('src/resources/database/cinema.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);

  console.log('Connection successful');
});

db.close((err) => {
  if (err) return console.error(err.message);
});/ */

const sqlite3 = require('sqlite3').verbose();
// const md5 = require('md5');

const DBSOURCE = 'src/resources/database/db.sqlite';

const db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE "rooms" (
        "roomId" INTEGER,
        "name" TEXT,
        "rows" INTEGER,
        "seatsPerRow" INTEGER,
        PRIMARY KEY("roomId" AUTOINCREMENT)
    )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO rooms (name, rows, seatsPerRow) VALUES (?,?,?)';
        db.run(insert, ['room 1', '1', '5']);
        db.run(insert, ['room 2', '2', '4']);
      }
    });
    db.run(`CREATE TABLE "presentations" (
        "presentationId" INTEGER,
        "timestamp" TIMESTAMP,
        "movieId" INTEGER,
        "roomId" INTEGER,
        PRIMARY KEY("presentationId" AUTOINCREMENT),
        FOREIGN KEY("roomId") REFERENCES "rooms"("roomId")
    )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO presentations (timestamp, movieId, roomId) VALUES (?,?,?)';
        db.run(insert, ['2022-01-15 17:30', '1', '2']);
      }
    });

    db.run(`CREATE TABLE "reservations" (
        "reservationId" INTEGER,
        "presentationId" INTEGER,
        "seats" INTEGER,
        "customer" TEXT,
        PRIMARY KEY("reservationId" AUTOINCREMENT),
        FOREIGN KEY("presentationId") REFERENCES "presentations"("presentationId")
    )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO reservations (presentationId, seats, customer) VALUES (?,?,?)';
        db.run(insert, ['1', '1', 'Joud']);
      }
    });

    db.run(`CREATE TABLE "movies" (
      "movieId" INTEGER,
      "name" TEXT,
      "posterName" TEXT,
      PRIMARY KEY("movieId" AUTOINCREMENT)
    )`,
    (err) => {
      if (err) {
      // Table already created
      } else {
      // Table just created, creating some rows
        const insert = 'INSERT INTO movies (name, posterName) VALUES (?,?)';
        db.run(insert, ['Sharknado', 'sharknado.png']);
        db.run(insert, ['The Room', 'the_room.png']);
        db.run(insert, ['Two Brothers', 'two_brothers.png']);
        db.run(insert, ['Star Wars - Episode 3', 'starwars.png']);
        db.run(insert, ['Harry Potter und der Stein der Weisen', 'harry_potter_1.png']);
      }
    });
  }
});

module.exports = db;
