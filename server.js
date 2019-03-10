const express = require("express");
const app = express();

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database/database.sqlite");

db.serialize(function() {
  db.run("CREATE TABLE reports");
  //var stmt = db.prepare('INSERT INTO lorem VALUES (?)')

  /* for (var i = 0; i < 10; i++) {
    stmt.run('Ipsum ' + i)
  } */

  /* stmt.finalize()

  db.each('SELECT rowid AS id, info FROM lorem', function (err, row) {
    console.log(row.id + ': ' + row.info)
  }) */
});

db.close();

app.get("/", (req, res) => {
  res.send("IoT server is working");
});

app.post("/post", (req, res) => {
  console.log("New post generated");
});

app.listen(3000, () => console.log("IoT server listening on port 3000"));
