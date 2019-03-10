const express = require("express");
const app = express();

var mysql = require("mysql");
var dbconn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "iot"
});

dbconn.connect(function(err) {
  if (err) {
    console.log("Database connection error");
  } else {
    console.log("Database connection successful");
  }
});

dbconn.end(function(err) {
  // Function to close database connection
});

app.get("/", (req, res) => {
  res.send("IoT server is working");
});

app.post("/post", (req, res) => {
  console.log("New post generated");
});

app.listen(3000, () => console.log("IoT server listening on port 3000"));
