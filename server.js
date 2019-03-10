const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("An alligator approaches!");
});

app.post("/post", (req, res) => {
  console.log("New post generated");
});

app.listen(3000, () => console.log("IoT server listening on port 3000"));
