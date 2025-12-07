const express = require("express");
const app = express();
app.use(express.json());

require("dotenv").config();
const db = require("./utils/db");

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
