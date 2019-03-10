const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

var mysql = require("mysql");
var dbconn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: "root",
  password: "root",
  database: "iot"
});

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

var moment = require("moment");

dbconn.connect(function(err) {
  if (err) {
    console.log("Database connection error");
  } else {
    console.log("Database connection successful");
  }
});

function checkAlarm() {
  setTimeout(function() {
    dbconn.query("SELECT * FROM alarms WHERE status = 'NEW'", function(
      err,
      res
    ) {
      if (err) throw err;
      if (res.length > 0) {
        var id = res[0].id;
        var CurrentDate = moment().format("YYYY-MM-DD HH:mm:ss");
        console.log(CurrentDate);
        var now = moment(res[0].inserted).format("YYYY-MM-DD HH:mm:ss");

        payload = {
          app_key: process.env.PUSHED_APP_KEY,
          app_secret: process.env.PUSHED_APP_SECRET,
          target_type: "app",
          content: "Brandlarmet har gått i " + res[0].location
        };
        //UPDATE table_name SET field1 = new-value1, field2 = new-value2
        //[WHERE Clause]
        axios.post("https://api.pushed.co/1/push", payload).then(res => {
          dbconn.query(
            "UPDATE alarms SET ? WHERE id ='" + id + "'",
            {
              status: "FINISHED",
              finished_at: now,
              pushed_message: res.data.response.message
            },
            function(err, res) {
              if (err) throw err;
            }
          );
        });
      }
    });
    checkAlarm();
  }, 1000);
}

checkAlarm();

app.get("/", (req, res) => {
  res.send("IoT server is working");
});

app.post("/alarm", (req, res) => {
  dbconn.query("INSERT INTO alarms SET ?", req.body, function(err, res) {
    if (err) throw err;
  });
});

app.post("/report", (req, res) => {
  dbconn.query("INSERT INTO reports SET ?", req.body, function(err, res) {
    if (err) throw err;

    console.log("Last record insert id:", res.insertId);
  });
});

app.listen(3000, () => console.log("IoT server listening on port 3000"));
