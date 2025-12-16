const express = require("express");
const router = express.Router();
const db = require("../utils/db");
const fs = require("fs");
const path = require("path");

const generateTerraform = require("../services/terraformGenerator");
const pushToGitOps = require("../services/gitService");
const simulateStatus = require("../services/statusSimulator");

// POST /api/generate
router.post("/", async (req, res) => {
  const { resources } = req.body;

  if (!resources) {
    return res.status(400).json({ error: "Resources missing" });
  }

  let deploymentId;

  try {
    // 1. Insert deployment (initial status = pending)
    const result = await db.query(
      "INSERT INTO deployments (selected_resources, status) VALUES ($1, $2) RETURNING id",
      [JSON.stringify(resources), "pending"]
    );

    deploymentId = result.rows[0].id;

    // 2. Start timeline simulation immediately
    simulateStatus(deploymentId);

    // 3. Respond EARLY (important UX fix)
    res.json({
      message: "Deployment created",
      deploymentId
    });

  } catch (error) {
    console.error("Error creating deployment:", error);
    return res.status(500).json({ error: "Deployment creation failed" });
  }

  // 4. Run heavy work in background (non-blocking)
  setImmediate(async () => {
    try {
      // Generate Terraform
      const generated = generateTerraform(resources, deploymentId);
      const sourceFolder = generated.folderPath;

      // Copy to GitOps repo
      const targetFolder = path.join(
        __dirname,
        `../../gitops-repo/deployments/${deploymentId}`
      );

      fs.mkdirSync(targetFolder, { recursive: true });

      fs.copyFileSync(
        path.join(sourceFolder, "main.tf"),
        path.join(targetFolder, "main.tf")
      );

      // Push to GitHub
      await pushToGitOps(targetFolder, deploymentId);

    } catch (bgError) {
      console.error("Background deployment error:", bgError);

      // Mark deployment as failed
      await db.query(
        "UPDATE deployments SET status = $1 WHERE id = $2",
        ["failed", deploymentId]
      );
    }
  });
});

module.exports = router;
