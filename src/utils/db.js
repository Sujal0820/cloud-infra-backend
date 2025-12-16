const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client
  .connect()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Error:", err));

module.exports = client;
