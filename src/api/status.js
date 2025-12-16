const express = require("express");
const router = express.Router();
const db = require("../utils/db");

// GET /api/status/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT id, selected_resources, status, created_at FROM deployments WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Deployment not found" });
    }

    const deployment = result.rows[0];

    return res.json({
      id: deployment.id,
      resources: deployment.selected_resources,
      status: deployment.status,
      created_at: deployment.created_at,
    });

  } catch (error) {
    console.error("Status check error:", error);
    return res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
