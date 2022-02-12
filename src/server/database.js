const sqlite3 = require('sqlite3').verbose();

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
        db.run(insert, ['room 1', '6', '8']);
        db.run(insert, ['room 2', '6', '10']);
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
      }
    });

    db.run(`CREATE TABLE "reservations" (
        "reservationId" INTEGER,
        "presentationId" INTEGER,
        "seats" TEXT,
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
        db.run(insert, ['4', '1A', 'Joud']);
      }
    });

    db.run(`CREATE TABLE "movies" (
      "movieId" INTEGER,
      "name" TEXT,
      "posterName" TEXT,
      "price" INTEGER,
      PRIMARY KEY("movieId" AUTOINCREMENT)
    )`,
    (err) => {
      if (err) {
      // Table already created
      } else {
      // Table just created, creating some rows
        const insert = 'INSERT INTO movies (name, posterName, price) VALUES (?,?,?)';
        db.run(insert, ['Sharknado', 'sharknado.png', '10']);
        db.run(insert, ['The Room', 'the_room.png', '10']);
        db.run(insert, ['Two Brothers', 'two_brothers.png', '10']);
        db.run(insert, ['Star Wars - Episode 3', 'starwars.png', '10']);
        db.run(insert, ['Harry Potter und der Stein der Weisen', 'harry_potter_1.png', '10']);
        db.run(insert, ['13 Hours', '13_hours.png', '10']);
        db.run(insert, ['Catch Me If You Can', 'catch_me_if_you_can.png', '10']);
        db.run(insert, ['Jaws', 'jaws.png', '10']);
        db.run(insert, ['Joker', 'joker.png', '10']);
        db.run(insert, ['Shrek', 'shrek.png', '10']);
        db.run(insert, ['Zombieland - Doubletap', 'zombieland_2.png', '10']);
      }
    });
  }
});

module.exports = db;
