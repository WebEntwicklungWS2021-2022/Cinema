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
    db.run(`CREATE TABLE "Kinosaal" (
        "saalId" INTEGER,
        "name" TEXT,
        "anzahlSitzreihen" INTEGER,
        "AnzahlSitzeProSitzreihe" INTEGER,
        PRIMARY KEY("saalId" AUTOINCREMENT)
    )
    `,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO Kinosaal (name, anzahlSitzreihen, AnzahlSitzeProSitzreihe) VALUES (?,?,?)';
        db.run(insert, ['admin', '1', '5']);
        db.run(insert, ['user', '2', '4']);
      }
    });
    db.run(`CREATE TABLE "Vorstellung" (
        "vorstellungsId" INTEGER,
        "datumUhrzeit" TIMESTAMP,
        "filmsname" TEXT NOT NULL,
        "saalId" INTEGER,
        "posterName" TEXT NOT NULL,
        PRIMARY KEY("vorstellungsId" AUTOINCREMENT),
        FOREIGN KEY("saalId") REFERENCES "kinosaal"("saalId")
    )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO Vorstellung (datumUhrzeit, filmsname, saalId, posterName) VALUES (?,?,?,?)';
        db.run(insert, ['2022-01-15 17:30', 'abc1', '2', 'hey']);
      }
    });
    db.run(`CREATE TABLE "Reservierung" (
        "reservierungsId" INTEGER,
        "vorstellungsId" INTEGER,
        "reservierteSitze" INTEGER,
        "kunde" TEXT,
        PRIMARY KEY("reservierungsId" AUTOINCREMENT),
        FOREIGN KEY("vorstellungsId") REFERENCES "vorstellung"("vorstellungsId")
    )`,
    (err) => {
      if (err) {
        // Table already created
      } else {
        // Table just created, creating some rows
        const insert = 'INSERT INTO Reservierung (vorstellungsId, reservierteSitze, kunde) VALUES (?,?,?)';
        db.run(insert, ['1', '1', 'Joud']);
      }
    });
  }
});

module.exports = db;
