const express = require("express");
const router = express.Router();
const db = require("../utils/db");

router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, status, selected_resources, created_at
       FROM deployments
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error("List deployments error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/init-db", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS deployments (
        id SERIAL PRIMARY KEY,
        selected_resources JSONB,
        status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    res.json({ message: "Database initialized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
